// Plucked electric-bass approximation (Karplus-Strong string + pickup filtering).
// All note pitches use equal temperament A4=440Hz; E1=41.203Hz, A1=55Hz, D2=73.416Hz, G2=97.999Hz.
(function(){
'use strict';
let ctx,cache=new Map();
function context(){if(!ctx)ctx=new (window.AudioContext||window.webkitAudioContext)();if(ctx.state==='suspended')ctx.resume();return ctx;}
function sample(c,f){const sr=c.sampleRate,key=Math.round(f*100)+'@'+sr;if(cache.has(key))return cache.get(key);
const length=Math.round(sr*3.8),buf=c.createBuffer(1,length,sr),a=buf.getChannelData(0),period=Math.max(2,Math.round(sr/f));
const ring=new Float32Array(period);let prev=0;
for(let i=0;i<period;i++){const noise=(Math.random()*2-1);prev=.68*prev+.32*noise;ring[i]=prev;}
let damp=0,lp=0;const decay=f<85?.9985:.9979;
for(let i=0;i<length;i++){const ix=i%period, v=ring[ix];damp=.5*(v+ring[(ix+1)%period]);ring[ix]=damp*decay;lp+=.36*(v-lp);let out=lp;
// Short pick/finger transient, fundamental and harmonics from plucked string.
if(i<sr*.009)out+=((Math.random()*2-1)*.10)*(1-i/(sr*.009));
a[i]=Math.tanh(out*2.4)*.56;
}
cache.set(key,buf);if(cache.size>70)cache.delete(cache.keys().next().value);return buf;}
function play(f,d=.45,vol=.2){if(!(f>20&&f<1400))return;const c=context(),now=c.currentTime,src=c.createBufferSource(),low=c.createBiquadFilter(),gain=c.createGain();
src.buffer=sample(c,f);low.type='lowpass';low.frequency.value=Math.min(1900,Math.max(450,f*11));low.Q.value=.35;
const end=Math.max(.13,Math.min(3.4,Number(d)||.45));gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(Math.min(.7,vol*2),now+.007);gain.gain.setTargetAtTime(Math.min(.7,vol*1.2),now+.009,.12);gain.gain.setTargetAtTime(.0001,now+Math.max(.08,end-.12),.065);
src.connect(low);low.connect(gain);gain.connect(c.destination);src.start(now);src.stop(now+Math.min(3.7,end+.2));src.onended=()=>{src.disconnect();low.disconnect();gain.disconnect()};}
window.XianjianBassSound={play,playMidi:(m,d,v)=>play(440*Math.pow(2,(m-69)/12),d,v)};
})();
