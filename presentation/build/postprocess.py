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


def timing_xml(targets, videos=()):
    """targets: list of (spid, kind, has_fill) in display order, grouped [(group, [..]), ...];
    videos: [(spid, duration_ms)] — embedded videos start automatically when the slide opens."""
    ids = iter(range(3, 10000))
    nid = lambda: next(ids)
    effects = []
    bld = []
    media_nodes = []
    first = True
    for spid, dur in videos:
        node = 'afterEffect' if first else 'withEffect'
        first = False
        c1, c2, c3 = nid(), nid(), nid()
        effects.append(
            f'<p:par><p:cTn id="{c1}" presetID="1" presetClass="mediacall" presetSubtype="0" fill="hold" nodeType="{node}">'
            f'<p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>'
            f'<p:cmd type="call" cmd="playFrom(0.0)"><p:cBhvr><p:cTn id="{c2}" dur="{dur}" fill="hold"/>'
            f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl></p:cBhvr></p:cmd></p:childTnLst></p:cTn></p:par>'
        )
        # when the clip ends, fade the video out: the still under it is the clip's last frame, so the slide
        # (and the outgoing Morph) continues from that frame instead of the poster (first frame)
        c4, c5, c6 = nid(), nid(), nid()
        effects.append(
            f'<p:par><p:cTn id="{c4}" presetID="10" presetClass="exit" presetSubtype="0" fill="hold" nodeType="withEffect">'
            f'<p:stCondLst><p:cond delay="{dur}"/></p:stCondLst><p:childTnLst>'
            f'<p:animEffect transition="out" filter="fade"><p:cBhvr><p:cTn id="{c5}" dur="400"/><p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl></p:cBhvr></p:animEffect>'
            f'<p:set><p:cBhvr><p:cTn id="{c6}" dur="1" fill="hold"><p:stCondLst><p:cond delay="399"/></p:stCondLst></p:cTn>'
            f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl><p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr>'
            f'<p:to><p:strVal val="hidden"/></p:to></p:set></p:childTnLst></p:cTn></p:par>'
        )
        media_nodes.append(
            f'<p:video><p:cMediaNode vol="0" mute="1"><p:cTn id="{c3}" fill="hold" display="0"><p:stCondLst><p:cond delay="indefinite"/></p:stCondLst></p:cTn>'
            f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl></p:cMediaNode></p:video>'
        )
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
        f'{"".join(media_nodes)}'
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
    ordered = sorted(groups.items())
    if len(ordered) > MAX_GROUPS:  # fold the tail into the last group instead of silently dropping it
        tail = [t for _, items in ordered[MAX_GROUPS - 1:] for t in items]
        ordered = ordered[:MAX_GROUPS - 1] + [(ordered[MAX_GROUPS - 1][0], tail)]
    return ordered


def renumber_shape_ids(s):
    """pptxgenjs reuses ids (e.g. the slide-number field gets id 25, tables get slideNum+1), which makes
    animation targets (spTgt spid) ambiguous. Give every repeated cNvPr id a fresh unique id."""
    ids = [int(x) for x in re.findall(r'<p:cNvPr id="(\d+)"', s)]
    seen, nxt = set(), max(ids + [1]) + 1

    def fix(m):
        nonlocal nxt
        i = int(m.group(1))
        if i in seen:
            i, nxt = nxt, nxt + 1
        seen.add(i)
        return f'<p:cNvPr id="{i}"'
    return re.sub(r'<p:cNvPr id="(\d+)"', fix, s)


# Alt text: pptxgenjs writes the absolute source path (or 'preencoded.png') into descr. Replace it with a
# human description; purely decorative layers (overlays, background, icons) get an empty descr.
ALT_RENDER = {
    'hero': 'мяч FootureX', 'stadium': 'FootureX Stadium', 'city': 'FootureX City', 'map': '3D-карта Узбекистана',
    'ai': 'AI-сеть', 'datacenter': 'дата-центр', 'arena': 'esports-арена', 'academy': 'FootureX Football Academy',
}
ALT_UI = {
    'game-home': 'главный экран FootureX Game', 'game-squad': 'экран состава FootureX Game', 'game-player': 'карточка игрока FootureX Game',
    'game-league': 'экран лиг FootureX Game', 'game-market': 'Marketplace FootureX Game', 'game-season': 'Battle Pass FootureX Game',
    'game-store': 'магазин FootureX Game (цены BX-013)', 'stadium-app': 'приложение стадиона', 'erp-dashboard': 'ERP-панель',
    'ai-console': 'AI-консоль', 'lms': 'учебная платформа академии', 'website': 'главная страница сайта FootureX (BX-006)',
    'flythrough-poster': 'облёт FootureX City',
}


def alt_text(path):
    base = os.path.splitext(os.path.basename(path))[0]
    if '/logo/' in path:
        return 'Логотип FootureX'
    if '/ui/' in path:
        return 'Концепт интерфейса: ' + ALT_UI.get(base, base)
    if '/renders/' in path or '/video/' in path:
        if base.startswith('ov-') or base.startswith('bg-'):
            return ''
        return 'Концептуальная визуализация: ' + ALT_RENDER.get(base.split('-')[0], base)
    return ''


def clean_descr(s):
    s = re.sub(r'descr="([^"]*)"', lambda m: f'descr="{alt_text(m.group(1)) if "/" in m.group(1) else ""}"', s)
    return s.replace('name="flythrough"', 'name="flythrough" descr="Видео: облёт концептуальной 3D-модели (автозапуск)"')


def theme_scheme():
    import json
    b = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'brand', 'brand.json'), encoding='utf-8'))['colors']
    pairs = [('dk1', b['bg']), ('lt1', 'FFFFFF'), ('dk2', b['surface']), ('lt2', b['soft']), ('accent1', b['accent2']), ('accent2', b['accent']),
             ('accent3', b['kit']), ('accent4', b['dot']), ('accent5', b['line']), ('accent6', b['outline']), ('hlink', b['accent']), ('folHlink', b['muted'])]
    return '<a:clrScheme name="FootureX">' + ''.join(f'<a:{k}><a:srgbClr val="{v}"/></a:{k}>' for k, v in pairs) + '</a:clrScheme>'


def mp4_duration_ms(data):
    """Read the movie duration from the mp4 'mvhd' box."""
    import struct
    i = data.find(b'mvhd')
    if i < 0:
        return 20000
    ver = data[i + 4]
    if ver == 1:
        ts, dur = struct.unpack('>IQ', data[i + 24:i + 36])
    else:
        ts, dur = struct.unpack('>II', data[i + 16:i + 24])
    return int(dur * 1000 / ts)


def find_videos(slide_xml, rels_xml, zin):
    """[(spid, duration_ms)] for every embedded video on the slide."""
    out = []
    for m in re.finditer(r'<p:pic>.*?</p:pic>', slide_xml, re.S):
        pic = m.group(0)
        v = re.search(r'<a:videoFile r:link="(rId\d+)"', pic)
        if not v:
            continue
        spid = re.search(r'<p:cNvPr id="(\d+)"', pic).group(1)
        tgt = re.search(r'Id="%s"[^>]*Target="\.\./media/([^"]+)"' % v.group(1), rels_xml)
        dur = mp4_duration_ms(zin.read('ppt/media/' + tgt.group(1))) if tgt else 20000
        out.append((spid, dur))
    return out


def dedupe_media(zin):
    """pptxgenjs stores one media copy per use. Map identical files (md5) to a single part."""
    import hashlib
    canon, drop = {}, {}
    for item in zin.infolist():
        if item.filename.startswith('ppt/media/'):
            h = hashlib.md5(zin.read(item.filename)).hexdigest() + os.path.splitext(item.filename)[1]
            if h in canon:
                drop[item.filename] = canon[h]
            else:
                canon[h] = item.filename
    return drop


def main(path):
    tmp = path + '.tmp'
    zin = zipfile.ZipFile(path)
    names = set(zin.namelist())
    drop = dedupe_media(zin)
    zout = zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED)
    stats = {'slides': 0, 'animated': 0, 'effects': 0, 'media_deduped': len(drop)}
    for item in zin.infolist():
        if item.filename in drop:
            continue
        data = zin.read(item.filename)
        if item.filename.endswith('.rels') and drop:
            s = data.decode('utf-8')
            for old, new in drop.items():
                s = s.replace('../media/' + os.path.basename(old) + '"', '../media/' + os.path.basename(new) + '"')
            data = s.encode('utf-8')
        if item.filename == '[Content_Types].xml':
            s = data.decode('utf-8').replace('ContentType="image/jpg"', 'ContentType="image/jpeg"')
            # pptxgenjs declares overrides for slide masters that are never written
            s = re.sub(r'<Override PartName="(/[^"]+)"[^>]*/>', lambda m: m.group(0) if m.group(1)[1:] in names else '', s)
            data = s.encode('utf-8')
        if re.match(r'ppt/theme/theme\d+\.xml$', item.filename):
            data = re.sub(r'<a:clrScheme .*?</a:clrScheme>', theme_scheme(), data.decode('utf-8'), count=1, flags=re.S).encode('utf-8')
        if re.match(r'ppt/(slides|slideLayouts|slideMasters)/[^/]+\.xml$', item.filename):
            data = clean_descr(data.decode('utf-8')).encode('utf-8')
        m = re.match(r'ppt/slides/slide(\d+)\.xml$', item.filename)
        if m:
            n = int(m.group(1))
            s = renumber_shape_ids(data.decode('utf-8'))
            if '<p:transition' in s or '<p:timing' in s:
                raise SystemExit(f'{item.filename}: already post-processed (run postprocess.py on a fresh build only)')
            targets = collect_targets(s.encode('utf-8'))
            rels_name = f'ppt/slides/_rels/slide{n}.xml.rels'
            videos = find_videos(s, zin.read(rels_name).decode('utf-8'), zin) if rels_name in names else []
            timing = timing_xml(targets, videos)
            stats['videos'] = stats.get('videos', 0) + len(videos)
            insert = transition_xml(n) + timing
            assert '</p:clrMapOvr>' in s, item.filename
            s = s.replace('</p:clrMapOvr>', '</p:clrMapOvr>' + insert, 1)
            data = s.encode('utf-8')
            stats['slides'] += 1
            if timing:
                stats['animated'] += 1
                stats['effects'] += sum(len(g[1]) for g in targets)
        zout.writestr(item.filename, data, compress_type=zipfile.ZIP_DEFLATED)
    zout.close()
    zin.close()
    shutil.move(tmp, path)
    print('postprocess:', stats)


if __name__ == '__main__':
    main(sys.argv[1])
