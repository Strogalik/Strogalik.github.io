"""Read real Chromium RGB/RGBA PNG samples; no image mutation or third-party dependency."""
from pathlib import Path
import struct,zlib,json,re,math,datetime
root=Path('qa/v6-a3/contrast')
def png(path):
 data=path.read_bytes();pos=8;raw=b''
 while pos<len(data):
  n=struct.unpack('>I',data[pos:pos+4])[0];kind=data[pos+4:pos+8];part=data[pos+8:pos+8+n];pos+=n+12
  if kind==b'IHDR':w,h,depth,color,_,_,inter=struct.unpack('>IIBBBBB',part);assert depth==8 and color in (2,6) and inter==0
  if kind==b'IDAT':raw+=part
 channels=3 if color==2 else 4;stride=w*channels;raw=zlib.decompress(raw);rows=[];prev=bytearray(stride);pos=0
 for _ in range(h):
  filt=raw[pos];pos+=1;row=bytearray(raw[pos:pos+stride]);pos+=stride
  for i in range(stride):
   a=row[i-channels] if i>=channels else 0;b=prev[i];c=prev[i-channels] if i>=channels else 0
   if filt==1:value=a
   elif filt==2:value=b
   elif filt==3:value=(a+b)//2
   elif filt==4:
    v=a+b-c;pa=abs(v-a);pb=abs(v-b);pc=abs(v-c);value=a if pa<=pb and pa<=pc else b if pb<=pc else c
   else:value=0
   row[i]=(row[i]+value)&255
  rows.append(row);prev=row
 return w,h,channels,rows
def lum(rgb):
 v=[x/255 for x in rgb];v=[x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in v];return sum(x*y for x,y in zip(v,[.2126,.7152,.0722]))
def ratio(fg,bg):
 a,b=sorted([lum(fg),lum(bg)]);return (b+.05)/(a+.05)
results=[]
for s in json.loads((root/'samples.json').read_text()):
 w,h,c,rows=png(root/s['file']);r=s['box'];fg=list(map(int,re.findall(r'\d+',s['color'])[:3]));values=[]
 # Inset prevents sampling outside the text support/rounded border; text itself was made transparent in DOM.
 for y in range(max(0,math.ceil(r['y']+5)),min(h,math.floor(r['y']+r['height']-5)),3):
  for x in range(max(0,math.ceil(r['x']+8)),min(w,math.floor(r['x']+r['width']-8)),3):values.append(ratio(fg,rows[y][x*c:x*c+3]))
 minimum=min(values);results.append({'name':s['name'],'foreground':s['color'],'sampleCount':len(values),'minimumRatio':round(minimum,3),'required':4.5,'pass':minimum>=4.5})
report={'date':datetime.datetime.now(datetime.timezone.utc).isoformat(),'status':'PASS' if all(r['pass'] for r in results) else 'FAIL','method':'Actual Chromium composite background pixels, text transparent only during measurement; interior samples at 3px grid, WCAG relative luminance. Conservative 4.5:1 for all measured text. Not a full accessibility certification.','results':results};Path('qa/v6-a3/contrast.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report));raise SystemExit(0 if report['status']=='PASS' else 1)
