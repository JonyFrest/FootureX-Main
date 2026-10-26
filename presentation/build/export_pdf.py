"""Export the deck to PDF without embedding the flythrough videos.

LibreOffice embeds slide videos into the PDF as attachments (~11 MB). For the distribution PDF a still frame
is enough, so the videos are turned into plain pictures (their poster frame) in a temporary copy first.

usage: python3 export_pdf.py ../output/FootureX_Uzbekistan_Corporate_Presentation.pptx
requires: LibreOffice (soffice) on PATH
"""
import os
import re
import shutil
import subprocess
import sys
import tempfile
import zipfile


def strip_videos(src, dst):
    with zipfile.ZipFile(src) as zin, zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename.startswith('ppt/media/') and item.filename.endswith('.mp4'):
                continue
            if re.match(r'ppt/slides/slide\d+\.xml$', item.filename):
                s = data.decode('utf-8')
                s = re.sub(r'<a:hlinkClick r:id="" action="ppaction://media"/>', '', s)
                s = re.sub(r'<a:videoFile r:link="rId\d+"/>', '', s)
                s = re.sub(r'<p:extLst>\s*<p:ext uri="\{DAA4B4D4-6D71-4841-9C94-3DE7FCFB9230\}">.*?</p:ext>\s*</p:extLst>', '', s, flags=re.S)
                s = re.sub(r'<p:video>.*?</p:video>', '', s, flags=re.S)
                data = s.encode('utf-8')
            if re.match(r'ppt/slides/_rels/slide\d+\.xml\.rels$', item.filename):
                s = data.decode('utf-8')
                s = re.sub(r'<Relationship [^>]*Target="\.\./media/[^"]+\.mp4"/>', '', s)
                data = s.encode('utf-8')
            zout.writestr(item.filename, data, compress_type=zipfile.ZIP_DEFLATED)


def main(pptx):
    pptx = os.path.abspath(pptx)
    out_dir = os.path.dirname(pptx)
    name = os.path.splitext(os.path.basename(pptx))[0]
    with tempfile.TemporaryDirectory() as tmp:
        copy = os.path.join(tmp, name + '.pptx')
        strip_videos(pptx, copy)
        subprocess.run(['soffice', '--headless', '--convert-to', 'pdf', '--outdir', tmp, copy], check=True, stdout=subprocess.DEVNULL, timeout=900)
        shutil.move(os.path.join(tmp, name + '.pdf'), os.path.join(out_dir, name + '.pdf'))
    print('wrote', os.path.join(out_dir, name + '.pdf'))


if __name__ == '__main__':
    main(sys.argv[1])
