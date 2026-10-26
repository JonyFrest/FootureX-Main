"""Add Morph transitions (with Fade fallback) and staged entrance animations to the generated deck.

PowerPoint's Morph needs PowerPoint 2019 / Microsoft 365; older versions and LibreOffice show the Fade fallback.
Entrance animations: every shape whose name starts with a<N>_ fades in, ordered by N, cascading automatically
after the slide transition (no clicks needed). Titles, backgrounds and renders are never animated.

usage: python3 postprocess.py deck.pptx
"""
import re
import sys
import zipfile
import shutil
import os

from lxml import etree

NS = {
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
}

# Slide-specific transition durations (ms). Chapter openers and the architectural tour get slower, cinematic morphs.
OPENERS = {1, 11, 21, 31, 41, 53, 63, 71, 83, 95, 107, 114, 117}
TOUR = set(range(83, 95))  # stadium + city virtual tour
STEP_MS = 160      # cascade offset between animation groups
EFFECT_MS = 450    # fade duration
MAX_GROUPS = 12


def transition_xml(n):
    dur = 2000 if n in TOUR else 1600 if n in OPENERS else 1100
    return (
        '<mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006">'
        '<mc:Choice xmlns:p159="http://schemas.microsoft.com/office/powerpoint/2015/09/main" '
        'xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" Requires="p159">'
        f'<p:transition spd="slow" p14:dur="{dur}"><p159:morph option="byObject"/></p:transition>'
        '</mc:Choice><mc:Fallback><p:transition spd="slow"><p:fade/></p:transition></mc:Fallback>'
        '</mc:AlternateContent>'
    )


def timing_xml(targets):
    """targets: list of (spid, kind, has_fill) in display order, grouped [(group, [..]), ...]"""
    ids = iter(range(3, 10000))
    nid = lambda: next(ids)
    effects = []
    bld = []
    first = True
    for gi, (_, items) in enumerate(targets):
        delay = gi * STEP_MS
        for spid, kind, has_fill, has_text in items:
            node = 'afterEffect' if first else 'withEffect'
            d = 0 if first else delay
            first = False
            c1, c2, c3 = nid(), nid(), nid()
            grp = ' grpId="0"' if kind != 'pic' else ''
            effects.append(
                f'<p:par><p:cTn id="{c1}" presetID="10" presetClass="entr" presetSubtype="0" fill="hold"'
                f'{grp} nodeType="{node}">'
                f'<p:stCondLst><p:cond delay="{d}"/></p:stCondLst><p:childTnLst>'
                f'<p:set><p:cBhvr><p:cTn id="{c2}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>'
                f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl><p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr>'
                f'<p:to><p:strVal val="visible"/></p:to></p:set>'
                f'<p:animEffect transition="in" filter="fade"><p:cBhvr><p:cTn id="{c3}" dur="{EFFECT_MS}"/>'
                f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl></p:cBhvr></p:animEffect>'
                f'</p:childTnLst></p:cTn></p:par>'
            )
            if kind == 'sp':
                ab = ' animBg="1"' if has_fill or not has_text else ''
                bld.append(f'<p:bldP spid="{spid}" grpId="0"{ab}/>')
            elif kind == 'chart':
                bld.append(f'<p:bldGraphic spid="{spid}" grpId="0"><p:bldAsOne/></p:bldGraphic>')
    if not effects:
        return ''
    inner = ''.join(effects)
    # renumber: ids 1,2 are root/mainSeq; outer click-group par uses the next free ids
    a, b = nid(), nid()
    xml = (
        '<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>'
        '<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>'
        f'<p:par><p:cTn id="{a}" fill="hold"><p:stCondLst><p:cond delay="indefinite"/><p:cond evt="onBegin" delay="0"><p:tn val="2"/></p:cond></p:stCondLst><p:childTnLst>'
        f'<p:par><p:cTn id="{b}" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>'
        f'{inner}'
        '</p:childTnLst></p:cTn></p:par>'
        '</p:childTnLst></p:cTn></p:par>'
        '</p:childTnLst></p:cTn><p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>'
        '<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq>'
        '</p:childTnLst></p:cTn></p:par></p:tnLst>'
        f'<p:bldLst>{"".join(bld)}</p:bldLst></p:timing>'
    )
    return xml


def collect_targets(xml_bytes):
    root = etree.fromstring(xml_bytes)
    tree = root.find('.//p:cSld/p:spTree', NS)
    groups = {}
    for el in tree:
        tag = etree.QName(el).localname
        if tag not in ('sp', 'pic', 'graphicFrame'):
            continue
        c = el.find('.//p:cNvPr', NS)
        if c is None:
            continue
        m = re.match(r'^a(\d+)_', c.get('name', ''))
        if not m:
            continue
        kind = tag
        if tag == 'graphicFrame':
            uri = el.find('.//a:graphicData', NS).get('uri', '')
            if not uri.endswith('/chart'):
                continue  # tables stay static
            kind = 'chart'
        has_fill = el.find('./p:spPr/a:solidFill', NS) is not None if tag == 'sp' else False
        has_text = bool(''.join(el.itertext()).strip()) if tag == 'sp' else False
        groups.setdefault(int(m.group(1)), []).append((c.get('id'), kind, has_fill, has_text))
    ordered = sorted(groups.items())[:MAX_GROUPS]
    return ordered


def theme_scheme():
    import json
    b = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'brand', 'brand.json'), encoding='utf-8'))['colors']
    pairs = [('dk1', b['bg']), ('lt1', 'FFFFFF'), ('dk2', b['surface']), ('lt2', b['soft']), ('accent1', b['accent2']), ('accent2', b['accent']),
             ('accent3', b['kit']), ('accent4', b['dot']), ('accent5', b['line']), ('accent6', b['outline']), ('hlink', b['accent']), ('folHlink', b['muted'])]
    return '<a:clrScheme name="FootureX">' + ''.join(f'<a:{k}><a:srgbClr val="{v}"/></a:{k}>' for k, v in pairs) + '</a:clrScheme>'


def main(path):
    tmp = path + '.tmp'
    zin = zipfile.ZipFile(path)
    zout = zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED)
    stats = {'slides': 0, 'animated': 0, 'effects': 0}
    for item in zin.infolist():
        data = zin.read(item.filename)
        if re.match(r'ppt/theme/theme\d+\.xml$', item.filename):
            data = re.sub(r'<a:clrScheme .*?</a:clrScheme>', theme_scheme(), data.decode('utf-8'), count=1, flags=re.S).encode('utf-8')
        m = re.match(r'ppt/slides/slide(\d+)\.xml$', item.filename)
        if m:
            n = int(m.group(1))
            s = data.decode('utf-8')
            targets = collect_targets(data)
            timing = timing_xml(targets)
            insert = transition_xml(n) + timing
            assert '</p:clrMapOvr>' in s, item.filename
            s = s.replace('</p:clrMapOvr>', '</p:clrMapOvr>' + insert, 1)
            data = s.encode('utf-8')
            stats['slides'] += 1
            if timing:
                stats['animated'] += 1
                stats['effects'] += sum(len(g[1]) for g in targets)
        zout.writestr(item, data)
    zout.close()
    zin.close()
    shutil.move(tmp, path)
    print('postprocess:', stats)


if __name__ == '__main__':
    main(sys.argv[1])
