/* Blackwood Mystery 3D — plain Three.js browser game, no build step. */
(() => {
  'use strict';

  // ---------- Scene setup ----------
  const canvas = document.querySelector('#game-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = false;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x171719);
  scene.fog = new THREE.Fog(0x171719, 24, 58);
  const camera = new THREE.PerspectiveCamera(54, innerWidth / innerHeight, .1, 100);
  scene.add(new THREE.HemisphereLight(0xb9c2d5, 0x282019, 1.55));
  const moon = new THREE.DirectionalLight(0xffdfb1, 1.15); moon.position.set(-12, 18, 8); scene.add(moon);
  const warmLights = [];
  const addPointLight = (x,z,color=0xffbd70,intensity=1.5,range=13) => { const l=new THREE.PointLight(color,intensity,range,2);l.position.set(x,2.4,z);scene.add(l);warmLights.push(l); };
  const mat = (color, roughness=.86) => new THREE.MeshStandardMaterial({color,roughness});
  const materials = { wall:mat(0x4b4035), wall2:mat(0x302d2b), floor:mat(0x30271f), wood:mat(0x513824), darkWood:mat(0x30251e), rug:mat(0x543d34), gold:mat(0xb58a4d), metal:mat(0x777b78), cream:mat(0xc9b998), green:mat(0x334538), red:mat(0x633f3a) };
  const rooms = [
    {name:'Main Hall',x:0,z:0,w:12,d:10,color:0x594638},
    {name:'Study',x:12,z:0,w:12,d:10,color:0x4b3027},
    {name:'Garden',x:24,z:0,w:12,d:10,color:0x354238},
    {name:'Library',x:-12,z:0,w:12,d:10,color:0x3c3933},
    {name:'Kitchen',x:0,z:-10,w:12,d:10,color:0x49443a},
    {name:'Guest Room',x:0,z:10,w:12,d:10,color:0x514038},
    {name:'Security Room',x:-12,z:-10,w:12,d:10,color:0x35383a}
  ];
  const colliders = [];
  function box(x,y,z,w,h,d,material,collide=false,geo=null){const mesh=new THREE.Mesh(geo||new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);scene.add(mesh);if(collide)colliders.push({minX:x-w/2,maxX:x+w/2,minZ:z-d/2,maxZ:z+d/2});return mesh;}
  function addWall(x,z,w,d){box(x,1.5,z,w,3,d,materials.wall,true);}
  function segmentedWall(x,z,w,d,gapAxis,gapCenter,gapWidth){
    if(gapAxis==='x'){const left=(w-gapWidth)/2;addWall(x-(gapWidth+left)/2,z,left, d);addWall(x+(gapWidth+left)/2,z,left,d);}
    else {const length=(d-gapWidth)/2;addWall(x,z-(gapWidth+length)/2,w,length);addWall(x,z+(gapWidth+length)/2,w,length);}
  }
  function floorFor(room){box(room.x,-.14,room.z,room.w, .28,room.d,mat(room.color),false);}
  rooms.forEach(floorFor);
  // Perimeter walls leave a real walkable door opening at each connection.
  // Shared-wall thickness is intentionally modest so door thresholds remain smooth.
  segmentedWall(0,-5,12,.32,'x',0,2.5); // Hall / Kitchen
  segmentedWall(0,5,12,.32,'x',0,2.5); // Hall / Guest Room
  segmentedWall(-6,0,.32,10,'z',0,2.5); // Hall / Library
  segmentedWall(6,0,.32,10,'z',0,2.5); // Hall / Study
  segmentedWall(18,0,.32,10,'z',0,2.5); // Study / Garden
  segmentedWall(-12,-5,12,.32,'x',-12,2.5); // Library / Security Room
  // Remaining room perimeters.
  addWall(0,-15,12,.32); addWall(0,15,12,.32);
  addWall(-18,0,.32,10); addWall(-12,-15,.32,10); addWall(-18,-10,.32,10); addWall(-6,-10,.32,10);
  addWall(-12,5,12,.32); addWall(12,-5,12,.32); addWall(12,5,12,.32);
  addWall(24,-5,12,.32);addWall(24,5,12,.32);addWall(30,0,.32,10);
  // Door lintels and warm pools of light, without expensive real-time shadows.
  [[0,-5],[0,5],[-6,0],[6,0],[18,0],[-12,-5]].forEach(([x,z])=>{box(x,2.85,z,2.55,.3,.38,materials.darkWood);});
  rooms.forEach(r=>addPointLight(r.x,r.z, r.name==='Garden'?0x9cad80:0xffbd78, r.name==='Main Hall'?1.9:1.15, 15));

  // ---------- Rooms and low-poly furniture ----------
  function furniture(room){
    const {x,z,name}=room;
    if(name==='Main Hall'){
      box(x,0.07,z,3.8,.12,3,materials.rug);box(x,1.1,z,1.7,2.1,.35,materials.darkWood,true);box(x,2.35,z,.12,.95,.12,materials.gold); // console + ornament
      box(x-3, .45,z,1.25,.9,.8,materials.wood,true);box(x+3,.45,z,1.25,.9,.8,materials.wood,true);
      // staircase-like decorative steps on back wall
      for(let i=0;i<5;i++)box(x-4+i*.48,.18+i*.12,z-3.8,.5,.22,1.2,materials.darkWood);
    } else if(name==='Study'){
      box(x,0.06,z,4.2,.12,3,materials.rug);box(x-1, .62,z-1.2,2.3,1.05,1.15,materials.wood,true);box(x-1,.04,z-1.2,2.35,.14,1.2,materials.gold); // desk
      box(x-1.8,.45,z+1.5,1.7,.9,.8,materials.darkWood,true); // chair
      box(x+3,.55,z-3.6,2.3,1.1,.55,materials.darkWood,true); // fireplace
      box(x+3,.13,z-3.3,1.4,.15,1.5,materials.rug);
      for(let i=0;i<3;i++)box(x-4.9,.8+i*.55,z-3+i*.95,.2,.44,.55,materials.wood);
    } else if(name==='Garden'){
      for(let i=0;i<5;i++){const tx=x-4+i*2;const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.13,.2,1.5,5),materials.wood);trunk.position.set(tx,.75,z-3.7);scene.add(trunk);const crown=new THREE.Mesh(new THREE.DodecahedronGeometry(.8,0),materials.green);crown.position.set(tx,1.75,z-3.7);scene.add(crown);}
      box(x, .35,z+2,2.1,.55,.65,materials.wood,true);box(x-4,.08,z+3.3,1.2,.14,.8,materials.rug);
    } else if(name==='Library'){
      for(let side of [-1,1]){box(x+side*4.8,1.35,z, .35,2.5,8,materials.darkWood,true);for(let i=0;i<4;i++)box(x+side*4.55,.55+i*.52,z,.24,.08,7.8,materials.gold);}
      box(x, .5,z-2.6,2.4,.8,1.1,materials.wood,true);box(x,.92,z-2.6,2.2,.08,.9,materials.gold);
    } else if(name==='Kitchen'){
      box(x-3,.6,z-3.6,5,.9,1,materials.darkWood,true);box(x+3,.6,z-3.6,4,.9,1,materials.darkWood,true);
      for(let i=0;i<3;i++)box(x-4+i*1.1,1.5,z-3.55,.75,.9,.7,materials.wood,true);
      box(x, .5,z+1,2.2,.8,1.4,materials.wood,true);
    } else if(name==='Guest Room'){
      box(x+1,.45,z-2.5,3.8,.8,2.5,materials.wood,true);box(x+1,.9,z-2.7,3.4,.12,2.2,materials.cream);box(x+1,1.16,z-3.35,1.1,.4,.55,materials.cream);
      box(x-4,.55,z+2,1.6,1.1,.8,materials.darkWood,true);box(x+4,.45,z+2,1.2,.9,.75,materials.wood,true);
    } else if(name==='Security Room'){
      box(x,.65,z-3.6,6,1.2,.6,materials.darkWood,true);for(let i=0;i<3;i++){box(x-2+i*2,1.75,z-3.4,1.6,.9,.1,materials.metal);box(x-2+i*2,1.75,z-3.32,1.35,.62,.03,mat(0x31403c));}
      box(x,.5,z+1,2.2,.8,1.2,materials.wood,true);
    }
  }
  rooms.forEach(furniture);

  // ---------- Player and camera ----------
  const player = new THREE.Group();scene.add(player);
  const coat=mat(0x252a30), skin=mat(0xc79c78), trousers=mat(0x252329), hatmat=mat(0x1d2024);
  const body=new THREE.Mesh(new THREE.CylinderGeometry(.29,.38,.95,7),coat);body.position.y=.95;player.add(body);
  const head=new THREE.Mesh(new THREE.IcosahedronGeometry(.25,1),skin);head.position.y=1.65;player.add(head);
  const hat=new THREE.Mesh(new THREE.CylinderGeometry(.25,.28,.16,8),hatmat);hat.position.y=1.89;player.add(hat);
  for(const s of [-1,1]){const leg=new THREE.Mesh(new THREE.CylinderGeometry(.11,.14,.65,6),trousers);leg.position.set(s*.16,.33,0);player.add(leg);}
  const playerLight=new THREE.PointLight(0xffd69a,.24,5);playerLight.position.set(0,2,0);player.add(playerLight);
  player.position.set(0,0,1);
  let yaw=0,pitch=.2,mouseDown=false,lastPointer={x:0,y:0};
  const keys=new Set();let gameStarted=false,gameOver=false,startedAt=0,lastActionAt=0,wrongAttempts=0,activePanel=null;
  const cameraTarget=new THREE.Vector3();
  function cameraUpdate(dt){
    const distance=7.8, height=2.3;
    cameraTarget.set(player.position.x + Math.sin(yaw)*distance*Math.cos(pitch),player.position.y+height+Math.sin(pitch)*distance,player.position.z+Math.cos(yaw)*distance*Math.cos(pitch));
    camera.position.lerp(cameraTarget,Math.min(1,dt*5.5));
    camera.lookAt(player.position.x,player.position.y+1.05,player.position.z);
  }
  function overlaps(x,z,r=.34){return colliders.some(c=>x+r>c.minX&&x-r<c.maxX&&z+r>c.minZ&&z-r<c.maxZ);}
  function movePlayer(dx,dz){let nx=player.position.x+dx,nz=player.position.z+dz;if(!overlaps(nx,player.position.z))player.position.x=nx;if(!overlaps(player.position.x,nz))player.position.z=nz;}
  function currentRoom(){return rooms.find(r=>player.position.x>=r.x-r.w/2-.45&&player.position.x<=r.x+r.w/2+.45&&player.position.z>=r.z-r.d/2-.45&&player.position.z<=r.z+r.d/2+.45)?.name||'Mansion Grounds';}
  canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;mouseDown=true;lastPointer={x:e.clientX,y:e.clientY};canvas.setPointerCapture?.(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(!mouseDown||!gameStarted||activePanel)return;const dx=e.clientX-lastPointer.x,dy=e.clientY-lastPointer.y;lastPointer={x:e.clientX,y:e.clientY};yaw-=dx*.006;pitch=THREE.MathUtils.clamp(pitch+dy*.004,-.18,.72);});
  canvas.addEventListener('pointerup',()=>mouseDown=false);canvas.addEventListener('pointercancel',()=>mouseDown=false);
  window.addEventListener('keydown',e=>{if(['Tab','ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key))e.preventDefault();if(e.key==='Escape'){closePanels();return;}if(e.key==='Tab'){if(gameStarted)toggleEvidence();return;}keys.add(e.key.toLowerCase());if(e.key==='e'||e.key==='E')interact();});
  window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));

  // ---------- Clues and interactable objects ----------
  const clueData=[
    {id:1,title:'The stopped pocket watch',desc:'A silver pocket watch stopped at exactly 9:40 PM. The time matches the estimated moment Arjun was killed.',points:'TIMELINE · Establishes time of death',room:'Study',x:10.1,z:.45,type:'watch'},
    {id:2,title:'Torn page of the new will',desc:'The page recovered from the fireplace says Arjun planned to remove Karan from his inheritance. The change gave Karan a powerful motive.',points:'POINTS TO KARAN · Inheritance motive',room:'Study',x:15,z:-3.45,type:'paper'},
    {id:3,title:'Muddy garden footprints',desc:'Fresh boot prints lead from the garden door toward the study. The killer entered from outside, contradicting Karan’s claim that he never went out.',points:'CONTRADICTS KARAN · Garden route',room:'Study',x:17.1,z:.15,type:'prints'},
    {id:4,title:'The K cufflink',desc:'A gold cufflink engraved with “K” lay beneath Arjun’s desk. It matches the initial on Karan’s formalwear.',points:'POINTS TO KARAN · Physical evidence',room:'Study',x:10.1,z:-1.55,type:'cufflink'},
    {id:5,title:'Gate log and CCTV note',desc:'The security record and camera note place Rahul outside the gate from 9:15 to 10:05 PM, away from the study at the time of the murder.',points:'CLEARS RAHUL · Verified alibi',room:'Security Room',x:-10,z:-8.5,type:'log'},
    {id:6,title:'Household log and phone record',desc:'The household log has Aman serving all 12 guests until 10 PM. The guest-room phone record confirms Priya’s call from 9:20 to 9:55 PM.',points:'CLEARS AMAN & PRIYA · Verified alibis',room:'Guest Room',x:2,z:12.2,type:'book'}
  ];
  const found=new Set();const clueObjects=[];
  function createClueObject(c){const group=new THREE.Group();group.position.set(c.x,.2,c.z);scene.add(group);const glow=new THREE.Mesh(new THREE.SphereGeometry(.55,8,6),new THREE.MeshBasicMaterial({color:0xe9b75e,transparent:true,opacity:.11}));group.add(glow);
    let item;if(c.type==='watch'){item=new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,.07,12),materials.gold);item.rotation.x=Math.PI/2;item.position.y=.08;}
    else if(c.type==='paper'){item=new THREE.Mesh(new THREE.BoxGeometry(.65,.04,.5),materials.cream);item.rotation.y=.2;item.position.y=.08;}
    else if(c.type==='prints'){item=new THREE.Mesh(new THREE.DodecahedronGeometry(.32,0),mat(0x5b4833));item.scale.set(1,.12,.55);item.position.y=.03;}
    else if(c.type==='cufflink'){item=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.08,8),materials.gold);item.position.y=.06;}
    else if(c.type==='log'){item=new THREE.Mesh(new THREE.BoxGeometry(.8,.12,.55),materials.green);item.position.y=.09;}
    else {item=new THREE.Mesh(new THREE.BoxGeometry(.65,.14,.48),materials.wood);item.position.y=.1;}
    group.add(item);group.userData.clue=c;clueObjects.push(group);
  }
  clueData.forEach(createClueObject);

  // ---------- Suspects, dialogue and reactions ----------
  const suspectData=[
    {name:'Rahul',role:'Business partner',motive:'Money dispute',room:'Garden',x:24,z:2.1,color:0x35424d},
    {name:'Aman',role:'Butler',motive:'Arjun scolded him',room:'Kitchen',x:2,z:-11.5,color:0x32383c},
    {name:'Priya',role:'Secretary',motive:'Arjun was about to fire her',room:'Guest Room',x:-2,z:11,color:0x4a3544},
    {name:'Karan',role:'Nephew',motive:'Inheritance',room:'Library',x:-13,z:1.5,color:0x493933}
  ];
  const suspectObjects=[];
  function makeSuspect(s){const group=new THREE.Group();group.position.set(s.x,0,s.z);scene.add(group);const body=new THREE.Mesh(new THREE.CylinderGeometry(.3,.4,1.03,7),mat(s.color));body.position.y=.98;group.add(body);const head=new THREE.Mesh(new THREE.IcosahedronGeometry(.26,1),skin);head.position.y=1.69;group.add(head);const hair=new THREE.Mesh(new THREE.SphereGeometry(.27,7,5),mat(s.name==='Priya'?0x302328:0x282523));hair.position.set(0,1.85,-.025);hair.scale.y=.48;group.add(hair);for(let side of [-1,1]){let leg=new THREE.Mesh(new THREE.CylinderGeometry(.12,.14,.65,6),trousers);leg.position.set(side*.16,.33,0);group.add(leg);}const badge=new THREE.Mesh(new THREE.SphereGeometry(.055,6,5),materials.gold);badge.position.set(.13,1.15,.29);group.add(badge);group.userData.suspect=s;suspectObjects.push(group);}
  suspectData.forEach(makeSuspect);
  function has(id){return found.has(id);}
  function dialogue(s){
    if(s.name==='Karan'&&[2,3,4].some(has)){
      const opts=[['Where were you at 9:40?','I was in the library reading. I never went outside.'],['What was your relationship with Arjun?','He was my uncle. We were… close enough.'],['Did you know about the will?','I knew nothing about any will change.'],['Show evidence','You have the will, those prints… and my cufflink. I—I went to the garden, but I didn’t kill him.']];
      if(has(2))opts[2][1]='I knew nothing about a new will. You cannot prove what Arjun intended.';
      if(has(3)||has(4))opts[0][1]='I was in the library. Those prints don’t prove I went outside… (Karan looks away.)';
      openDialogue(s.name,s.role+' · NEPHEW','Karan folds his arms, but his eyes keep drifting toward the study.',opts, true);return;
    }
    let opts;
    if(s.name==='Rahul')opts=[['Where were you at 9:40?','I went outside the gate to take a phone call. Check the security record.'],['Your relationship with Arjun?','We argued about money, but I would never hurt him.'],['Did you see anything?','I saw Karan near the garden entrance earlier. He seemed agitated.']];
    if(s.name==='Aman')opts=[['Where were you at 9:40?','Serving dinner to all twelve guests. I was in and out of the kitchen all evening.'],['Your relationship with Arjun?','He scolded me that afternoon, but I have served this family for years.'],['Did you see anything?','I noticed Karan’s boots were muddy after he returned inside.']];
    if(s.name==='Priya')opts=[['Where were you at 9:40?','I was on a call in the guest room. It was recorded on the office line.'],['Your relationship with Arjun?','He intended to dismiss me. I was upset, but I did not kill him.'],['Did you see anything?','I heard the garden door close shortly before the clock struck ten.']];
    if(has(5)&&s.name==='Rahul')opts[0][1]='The gate log and CCTV prove I was outside from 9:15 to 10:05. I could not have been in the study.';
    if(has(6)&&s.name==='Aman')opts[0][1]='The household log is right. I served all twelve guests until 10 PM; they can all confirm it.';
    if(has(6)&&s.name==='Priya')opts[0][1]='The phone record confirms my call from 9:20 to 9:55. I never left the guest room.';
    openDialogue(s.name,s.role.toUpperCase()+' · SUSPECT',`${s.name} watches you carefully. Motive: ${s.motive.toLowerCase()}.`,opts,false);
  }

  // ---------- UI, board and case flow ----------
  const $=sel=>document.querySelector(sel);const hud=$('#hud'),controls=$('#controls'),objective=$('#objective'),prompt=$('#interaction-prompt');
  function show(el){el.classList.remove('hidden');}function hide(el){el.classList.add('hidden');}
  function setObjective(text){objective.textContent=text;}
  function updateCount(){$('#clue-count').textContent=found.size;}
  function openPanel(id){closePanels();activePanel=id;show($(id));}
  function closePanels(){['#dialogue-panel','#evidence-panel','#clue-popup'].forEach(sel=>hide($(sel)));activePanel=null;}
  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closePanels()));
  function openDialogue(title,kicker,text,options,isKaran){openPanel('#dialogue-panel');$('#dialogue-title').textContent=title;$('#dialogue-kicker').textContent=kicker;$('#dialogue-text').textContent=text;const list=$('#dialogue-options');list.innerHTML='';options.forEach(([q,a])=>{const b=document.createElement('button');b.className='dialogue-option';b.textContent=q;b.onclick=()=>{const showEvidence=q==='Show evidence';$('#dialogue-text').textContent=a;if(showEvidence){b.disabled=true;b.textContent='Evidence presented';b.style.opacity='.55';setObjective('Karan is rattled. Find proof and make your accusation on the Evidence Board.');}else{list.querySelectorAll('.dialogue-option').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');}lastActionAt=Date.now();};list.appendChild(b);});}
  function collectClue(obj){const c=obj.userData.clue;if(found.has(c.id))return;found.add(c.id);scene.remove(obj);updateCount();lastActionAt=Date.now();$('#clue-popup-title').textContent=c.title;$('#clue-popup-desc').textContent=c.desc;$('#clue-popup-points').textContent=c.points;openPanel('#clue-popup');setObjective(found.size===6?'All evidence collected. Review the board and accuse the murderer.':`${found.size} of 6 clues found. Search the mansion for more evidence.`);}
  function renderBoard(){const grid=$('#evidence-grid');grid.innerHTML='';clueData.forEach(c=>{if(found.has(c.id)){const card=document.createElement('article');card.className='evidence-card';card.innerHTML=`<h3>${c.title}</h3><p>${c.desc}</p><small>${c.points}</small>`;grid.appendChild(card);}else{const card=document.createElement('div');card.className='evidence-card unfound';card.textContent='Evidence not yet discovered';grid.appendChild(card);}});$('#attempts-label').textContent=`Attempts remaining: ${3-wrongAttempts}`;$('#accuse-button').disabled=found.size<4;$('#accuse-button').textContent=found.size<4?`Find ${4-found.size} more clue${4-found.size===1?'':'s'} to accuse`:'Accuse a suspect →';$('#accusation-form').classList.add('hidden');$('#accusation-feedback').textContent='';}
  function toggleEvidence(){if(activePanel==='#evidence-panel'){closePanels();return;}renderBoard();openPanel('#evidence-panel');}
  $('#board-button').addEventListener('click',toggleEvidence);
  $('#accuse-button').addEventListener('click',()=>{if(found.size<4)return;$('#accusation-form').classList.remove('hidden');const p=$('#proof-options');p.innerHTML='';clueData.filter(c=>found.has(c.id)).forEach(c=>{const label=document.createElement('label');label.className='proof-option';label.innerHTML=`<input type="checkbox" value="${c.id}"> ${c.title}`;p.appendChild(label);});});
  $('#submit-accusation').addEventListener('click',()=>{const suspect=$('#suspect-select').value;const proofs=[...document.querySelectorAll('#proof-options input:checked')].map(e=>Number(e.value));const feedback=$('#accusation-feedback');if(!suspect||proofs.length!==2){feedback.textContent='Choose one suspect and exactly two pieces of evidence.';return;}lastActionAt=Date.now();if(suspect==='Karan'&&proofs.filter(id=>[2,3,4].includes(id)).length>=2){winGame();return;}wrongAttempts++;$('#attempts-label').textContent=`Attempts remaining: ${3-wrongAttempts}`;feedback.textContent='Inspector Rao: “Not enough evidence. Revisit the clues and question the suspects.”';if(wrongAttempts>=3)setTimeout(unsolvedGame,1400);});

  function nearestInteractable(){let best=null,bestDist=2.2;for(const o of clueObjects){if(found.has(o.userData.clue.id))continue;const d=player.position.distanceTo(new THREE.Vector3(o.position.x,0,o.position.z));if(d<bestDist){best=o;bestDist=d;}}for(const o of suspectObjects){const d=player.position.distanceTo(new THREE.Vector3(o.position.x,0,o.position.z));if(d<bestDist){best=o;bestDist=d;}}return best;}
  function interact(){if(!gameStarted||activePanel||gameOver)return;const obj=nearestInteractable();if(!obj)return;lastActionAt=Date.now();if(obj.userData.clue)collectClue(obj);else dialogue(obj.userData.suspect);}
  function winGame(){gameOver=true;closePanels();$('#ending-icon').textContent='✦';$('#ending-kicker').textContent='CASE SOLVED · KARAN ARRESTED';$('#ending-title').textContent='Justice for Arjun.';$('#ending-copy').textContent='Confronted with the will, the garden trail and the cufflink, Karan breaks down and confesses. Inspector Rao places him under arrest. The Blackwood family can finally mourn in peace.';const seconds=Math.floor((Date.now()-startedAt)/1000);const minutes=Math.floor(seconds/60),remaining=seconds%60;const rank=(found.size===6&&wrongAttempts===0&&seconds<600)?'Master Detective':(wrongAttempts<=1&&found.size>=5?'Detective':'Rookie');$('#score-breakdown').innerHTML=`<div><strong>${minutes}:${String(remaining).padStart(2,'0')}</strong><small>TIME</small></div><div><strong>${found.size}/6</strong><small>CLUES</small></div><div><strong>${rank}</strong><small>RANK</small></div>`;endScreen();}
  function unsolvedGame(){gameOver=true;closePanels();$('#ending-icon').textContent='…';$('#ending-kicker').textContent='THREE ACCUSATIONS · NO CONVICTION';$('#ending-title').textContent='Case Closed Unsolved';$('#ending-copy').textContent='Inspector Rao closes the file. The truth is still somewhere inside Blackwood Mansion. Reopen the case and follow the evidence more carefully.';$('#score-breakdown').innerHTML=`<div><strong>${found.size}/6</strong><small>CLUES FOUND</small></div><div><strong>${wrongAttempts}</strong><small>WRONG ACCUSATIONS</small></div>`;endScreen();}
  function endScreen(){show($('#ending-screen'));}
  $('#retry-button').addEventListener('click',()=>location.reload());
  $('#start-button').addEventListener('click',()=>{hide($('#start-screen'));show(hud);show(controls);show(objective);gameStarted=true;startedAt=Date.now();lastActionAt=Date.now();openDialogue('Inspector Rao','CASE BRIEFING · 9:40 PM','Arjun Blackwood was murdered in his study during tonight’s dinner party. Four people had a reason to want him dead. Find the clues, question each suspect, and bring me two solid pieces of proof. Use WASD to move, Shift to run, drag to look, and E to interact. Tab opens your evidence board.',[['I understand. Begin investigating.','The study is east of the Main Hall. The rest of the mansion is connected by open doorways. Be thorough, Detective.']],false);});
  function hint(){if(!gameStarted||gameOver||activePanel)return;const missing=clueData.filter(c=>!found.has(c.id));let text;if(missing.length===0)text='You have the full case. The will, garden trail, and K cufflink together point to Karan. Accuse him with any two of those three.';else{const next=missing[0];text=next.id===1?'Inspector Rao: “Start in the Study. The stopped watch can anchor the timeline.”':next.id===2?'Inspector Rao: “Look around the Study fireplace. Arjun’s new will may reveal who stood to lose everything.”':next.id===3?'Inspector Rao: “Trace the route between the garden door and the Study.”':next.id===4?'Inspector Rao: “Search beneath the Study desk for something dropped in the struggle.”':next.id===5?'Inspector Rao: “Rahul’s alibi can be checked in the Security Room.”':'Inspector Rao: “The Guest Room has the household and telephone records.”';}$('#hint-toast').textContent=text;show($('#hint-toast'));setTimeout(()=>hide($('#hint-toast')),8000);lastActionAt=Date.now();}

  // ---------- Main loop and performance ----------
  let previous=performance.now(), elapsed=0;
  function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-previous)/1000,.05);previous=now;elapsed+=dt;
    if(gameStarted&&!activePanel&&!gameOver){let forward=(keys.has('w')?1:0)-(keys.has('s')?1:0),side=(keys.has('d')?1:0)-(keys.has('a')?1:0);const speed=(keys.has('shift')?5.3:3.1)*dt;const len=Math.hypot(forward,side)||1;forward/=len;side/=len;const dx=(Math.sin(yaw)*forward+Math.cos(yaw)*side)*speed,dz=(Math.cos(yaw)*forward-Math.sin(yaw)*side)*speed;if(dx||dz){movePlayer(dx,dz);player.rotation.y=Math.atan2(dx,dz);lastActionAt=Date.now();}
      if(keys.has('arrowleft'))yaw+=dt*1.8;if(keys.has('arrowright'))yaw-=dt*1.8;if(keys.has('arrowup'))pitch=THREE.MathUtils.clamp(pitch-dt*.8,-.18,.72);if(keys.has('arrowdown'))pitch=THREE.MathUtils.clamp(pitch+dt*.8,-.18,.72);
      const near=nearestInteractable();if(near){show(prompt);prompt.querySelector('span').textContent=near.userData.clue?`Collect: ${near.userData.clue.title}`:`Talk to ${near.userData.suspect.name}`;}else hide(prompt);
      if(Date.now()-lastActionAt>=120000)hint();
    }
    clueObjects.forEach((o,i)=>{if(o.parent){o.rotation.y+=dt*.55;o.position.y=.18+Math.sin(elapsed*2+i)*.07;}});
    suspectObjects.forEach((o,i)=>{o.rotation.y=Math.sin(elapsed*.6+i)*.12;});
    cameraUpdate(dt);$('#room-name').textContent=currentRoom();renderer.render(scene,camera);
  }
  requestAnimationFrame(animate);
  window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.setSize(innerWidth,innerHeight);});
})();
