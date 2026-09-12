// ═══════ STATE ═══════
const S={
  role:null,prev:'s-land',rating:0,shopOpen:true,
  inQueue:false,myTok:7,mySvc:'Hair Cut',myShopId:0,
  selectedSvc:0,selectedShop:null,

  services:[
    {id:1,name:'Hair Cut',price:250,dur:20,ico:'💇'},
    {id:2,name:'Beard Trim',price:150,dur:15,ico:'🧔'},
    {id:3,name:'Hair Color',price:800,dur:60,ico:'🎨'},
    {id:4,name:'Facial',price:600,dur:45,ico:'✨'},
    {id:5,name:'Hair Spa',price:1200,dur:90,ico:'💆'},
  ],

  shops:[
    {id:0,name:'Royal Cuts',owner:'Rahul Sharma',rating:4.8,rev:234,addr:'Hazratganj, Lucknow',cur:3,q:6,wait:28,open:true,clr:'#f5c842',ico:'👑',svcs:[0,1,2,3]},
    {id:1,name:'The Blade Room',owner:'Amit Singh',rating:4.6,rev:189,addr:'Gomtinagar, Lucknow',cur:7,q:4,wait:18,open:true,clr:'#00d4aa',ico:'⚔️',svcs:[0,1,4]},
    {id:2,name:'Style Studio',owner:'Priya Verma',rating:4.9,rev:312,addr:'Alambagh, Lucknow',cur:12,q:2,wait:8,open:true,clr:'#ff6b9d',ico:'💎',svcs:[0,1,2,3,4]},
    {id:3,name:'Classic Barber',owner:'Suresh Kumar',rating:4.4,rev:98,addr:'Chowk, Lucknow',cur:5,q:8,wait:36,open:false,clr:'#a29bfe',ico:'🪒',svcs:[0,1]},
  ],

  bq:[
    {tok:3,name:'Rajesh K.',svc:'Hair Cut',dur:20,st:'cur',eta:0},
    {tok:4,name:'Amit S.',svc:'Beard Trim',dur:15,st:'nxt',eta:20},
    {tok:5,name:'Priya M.',svc:'Hair Color',dur:60,st:'wait',eta:35},
    {tok:6,name:'Suresh P.',svc:'Hair Cut',dur:20,st:'wait',eta:95},
    {tok:7,name:'Anuj T.',svc:'Hair Spa',dur:90,st:'wait',eta:115},
    {tok:8,name:'Deepa R.',svc:'Facial',dur:45,st:'wait',eta:205},
  ],

  earn:1840,doneCnt:8
};


// ═══════ NAV ═══════
function go(id){

  const cur=document.querySelector('.screen.active');

  if(cur)S.prev=cur.id;

  document.querySelectorAll('.screen')
    .forEach(s=>s.classList.remove('active'));

  document.getElementById(id).classList.add('active');

  if(id==='s-cust'){
    renderShops();
    renderMyQ();
  }

  if(id==='s-barb'){
    renderBQ();
    renderSvcs();
    renderAnalytics();
  }

  if(id==='s-prof')
    renderProfile();
}

function demoAs(r){
  S.role=r;
  go(r==='customer'?'s-cust':'s-barb');
}

function openProfile(){
  go('s-prof');
}


// ═══════ HELPERS ═══════
function showEl(id){
  document.getElementById(id).style.display='block';
}

function hideEl(id){
  document.getElementById(id).style.display='none';
}

function openModal(id){
  document.getElementById(id).classList.add('open');
}

function closeModal(id){
  document.getElementById(id).classList.remove('open');
}

let tTimer;

function toast(ico,msg){

  document.getElementById('t-ico').textContent=ico;
  document.getElementById('t-msg').textContent=msg;

  const el=document.getElementById('toast');

  el.classList.add('show');

  clearTimeout(tTimer);

  tTimer=setTimeout(
    ()=>el.classList.remove('show'),
    3000
  );
}


// ═══════ AUTH ═══════
function sendOtp(){

  const v=document.getElementById('ph').value.trim();

  if(!v){
    toast('⚠️','Please enter your phone number');
    return;
  }

  document.getElementById('ph-show').textContent='+91 '+v;

  hideEl('auth-p1');
  showEl('auth-p2');

  toast('📱','OTP sent! Use code 1234');

  setTimeout(
    ()=>document.getElementById('o0').focus(),
    100
  );
}

function otpFwd(el,i){

  if(
    el.value.length===1 &&
    i<3
  )
    document.getElementById('o'+(i+1)).focus();
}

function otpBack(el,i,e){

  if(
    e.key==='Backspace' &&
    !el.value &&
    i>0
  )
    document.getElementById('o'+(i-1)).focus();
}

function verifyOtp(){

  const code=[
    0,1,2,3
  ]
  .map(i=>document.getElementById('o'+i).value)
  .join('');

  if(code==='1234'){

    toast('✅','Verified! Welcome to TrimQ');

    go('s-role');

  }else{

    toast('❌','Wrong OTP. Hint: use 1234');

    [0,1,2,3]
      .forEach(
        i=>document.getElementById('o'+i).value=''
      );

    document.getElementById('o0').focus();
  }
}


// ═══════ CUSTOMER ═══════
function renderShops(){

  document.getElementById('shop-list').innerHTML=

  S.shops.map(s=>`

    <div class="shop-card"
    onclick="openShop(${s.id})">

      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">

        <div style="width:48px;height:48px;border-radius:12px;background:${s.clr}20;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0">
          ${s.ico}
        </div>

        <div style="flex:1;min-width:0">

          <div style="font-weight:700;font-size:15px;font-family:'Syne',sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
            ${s.name}
          </div>

          <div style="font-size:12px;color:var(--txt2)">
            ${s.addr}
          </div>

        </div>

        <span class="tag ${s.open?'tgreen':'tred'}"
        style="flex-shrink:0">
          ${s.open?'Open':'Closed'}
        </span>

      </div>

      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">

        <span class="tag tgray">
          ⭐ ${s.rating} (${s.rev})
        </span>

        <span class="tag tgray">
          🎫 Queue: ${s.q}
        </span>

        <span class="tag tgray">
          ⏱ ~${s.wait} min
        </span>

      </div>

      <div style="display:flex;justify-content:space-between;align-items:center">

        <div style="font-size:13px;color:var(--txt2)">
          Serving:
          <strong style="color:var(--gold)">
            #${s.cur}
          </strong>
        </div>

        <div style="font-size:13px;color:var(--gold);font-weight:500">
          View & Join →
        </div>

      </div>

    </div>

  `).join('');
}


function openShop(id){

  S.selectedShop=id;

  const s=S.shops[id];

  document.getElementById('sh-title').textContent=s.name;

  const inQ=S.inQueue&&S.myShopId===id;

  document.getElementById('sh-body').innerHTML=`

    <div style="background:${s.clr}12;border:1px solid ${s.clr}30;border-radius:var(--rl);padding:20px;margin-bottom:18px;text-align:center">

      <div style="font-size:52px;margin-bottom:8px">
        ${s.ico}
      </div>

      <div style="font-size:24px;font-weight:800;font-family:'Syne',sans-serif;margin-bottom:6px">
        ${s.name}
      </div>

      <div style="color:var(--txt2);font-size:13px;margin-bottom:10px">
        ${s.addr} · ${s.owner}
      </div>

      <div style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap">

        <span class="tag"
        style="background:rgba(0,0,0,.3);border:1px solid ${s.clr}40;color:${s.clr}">
          ⭐ ${s.rating} · ${s.rev} reviews
        </span>

        <span class="tag ${s.open?'tgreen':'tred'}">
          ${s.open?'● Open':'● Closed'}
        </span>

      </div>

    </div>


    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:18px">

      <div class="stat"
      style="text-align:center;padding:14px 8px">

        <div class="stat-n"
        style="color:var(--gold);font-size:26px">
          #${s.cur}
        </div>

        <div class="stat-l">
          Serving Now
        </div>

      </div>


      <div class="stat"
      style="text-align:center;padding:14px 8px">

        <div class="stat-n"
        style="font-size:26px">
          ${s.q}
        </div>

        <div class="stat-l">
          In Queue
        </div>

      </div>


      <div class="stat"
      style="text-align:center;padding:14px 8px">

        <div class="stat-n"
        style="color:var(--cyan);font-size:26px">
          ${s.wait}
        </div>

        <div class="stat-l">
          Min Wait
        </div>

      </div>

    </div>


    <div style="font-size:17px;font-weight:700;font-family:'Syne',sans-serif;margin-bottom:12px">
      Services Offered
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px">

      ${s.svcs.map(si=>{

        const sv=S.services[si];

        return`

          <div class="card card-p"
          style="display:flex;align-items:center;gap:10px">

            <span style="font-size:24px">
              ${sv.ico}
            </span>

            <div>

              <div style="font-weight:500;font-size:14px">
                ${sv.name}
              </div>

              <div style="color:var(--gold);font-weight:600;font-size:14px">
                ₹${sv.price}
              </div>

              <div style="color:var(--txt2);font-size:12px">
                ~${sv.dur} min
              </div>

            </div>

          </div>

        `

      }).join('')}

    </div>


    <div style="font-size:17px;font-weight:700;font-family:'Syne',sans-serif;margin-bottom:12px">
      Live Queue Preview
    </div>


    ${S.bq.slice(0,5).map(q=>`

      <div class="qi ${q.st==='cur'?'cur':q.st==='nxt'?'nxt':''}">

        <div class="qi-num"
        style="background:${q.st==='cur'?'var(--gdim)':q.st==='nxt'?'var(--cdim)':'var(--s3)'};color:${q.st==='cur'?'var(--gold)':q.st==='nxt'?'var(--cyan)':'var(--txt2)'}">

          ${q.tok}

        </div>

        <div style="flex:1">

          <div style="font-size:14px;font-weight:500">
            ${q.st==='cur'?q.name:'Customer '+q.tok}
          </div>

          <div style="font-size:12px;color:var(--txt2)">
            ${q.svc}
          </div>

        </div>

        <div>

          ${
            q.st==='cur'
            ?'<span class="tag tg pulse">Now</span>'
            :q.st==='nxt'
            ?'<span class="tag tgreen">Next</span>'
            :'<span style="font-size:12px;color:var(--txt2)">~'+q.eta+' min</span>'
          }

        </div>

      </div>

    `).join('')}


    ${inQ?`

      <div style="background:var(--gdim);border:2px solid var(--gold);border-radius:var(--rl);padding:20px;margin-top:16px;text-align:center">

        <div style="font-size:12px;color:var(--txt2);margin-bottom:4px">
          You're in queue!
        </div>

        <div style="font-size:60px;font-weight:800;font-family:'Syne',sans-serif;color:var(--gold);line-height:1">
          #${S.myTok}
        </div>

        <div style="font-size:13px;color:var(--txt2);margin-top:4px">
          ${S.mySvc}
        </div>

        <div style="display:flex;gap:8px;justify-content:center;margin-top:12px">

          <button class="btn btn-red btn-sm"
          onclick="leaveQ()">
            Leave Queue
          </button>

          <button class="btn btn-outline btn-sm"
          onclick="openModal('m-rate');document.getElementById('rate-shop-name').textContent='${s.name}'">
            Rate Shop ⭐
          </button>

        </div>

      </div>

    `:`

      <button class="btn ${s.open?'btn-gold':'btn-outline'} btn-full"
      style="height:52px;font-size:16px;margin-top:16px"
      onclick="${s.open?"openJoinModal()":'toast(\"⛔\",\"This shop is currently closed\")'}">

        ${s.open?'Join Queue →':'Shop is Closed'}

      </button>

    `}

    <div style="height:24px"></div>

  `;

  go('s-shop');

  if(s.open)
    buildJoinModal();
}


function buildJoinModal(){

  const s=S.shops[S.selectedShop];

  S.selectedSvc=0;

  document.getElementById('m-svcs').innerHTML=

  s.svcs.map((si,i)=>{

    const sv=S.services[si];

    return`

      <div class="svc-chip ${i===0?'sel':''}"
      onclick="pickSvc(${i})">

        <div style="font-size:24px">
          ${sv.ico}
        </div>

        <div style="font-size:13px;font-weight:500;margin-top:4px">
          ${sv.name}
        </div>

        <div class="svc-price">
          ₹${sv.price}
        </div>

      </div>

    `

  }).join('');

  updateJoinInfo();
}


function pickSvc(i){

  S.selectedSvc=i;

  document.querySelectorAll('.svc-chip')
  .forEach(
    (c,idx)=>c.classList.toggle('sel',idx===i)
  );

  updateJoinInfo();
}


function updateJoinInfo(){

  const s=S.shops[S.selectedShop];

  document.getElementById('m-tok').textContent='#'+(s.q+1);

  document.getElementById('m-wait').textContent='~'+s.wait+' min';
}


function openJoinModal(){

  buildJoinModal();

  openModal('m-join');
}


function confirmJoin(){

  const s=S.shops[S.selectedShop];

  const svcIdx=s.svcs[S.selectedSvc];

  S.inQueue=true;

  S.myTok=s.q+1;

  S.mySvc=S.services[svcIdx].name;

  S.myShopId=S.selectedShop;

  s.q++;

  closeModal('m-join');

  document.getElementById('ok-tok').textContent=S.myTok;

  document.getElementById('ok-sub').textContent=
    'Token #'+S.myTok+' · ~'+s.wait+' min wait';

  document.getElementById('ok-svc').textContent=S.mySvc;

  openModal('m-ok');

  setTimeout(
    ()=>toast('🔔','Heads up! 2 people ahead of you in queue'),
    12000
  );
}


function leaveQ(){

  S.inQueue=false;

  toast('👋','You left the queue');

  if(S.selectedShop!==null)
    openShop(S.selectedShop);
}


function renderMyQ(){

  const el=document.getElementById('my-q');

  if(!el)return;

  if(!S.inQueue){

    el.innerHTML=`

      <div style="text-align:center;padding:60px 20px">

        <div style="font-size:52px;margin-bottom:12px">
          🎫
        </div>

        <div style="font-size:20px;font-weight:700;font-family:'Syne',sans-serif;margin-bottom:8px">
          No Active Queue
        </div>

        <p style="color:var(--txt2);font-size:14px;margin-bottom:20px">
          Browse nearby shops and join a queue!
        </p>

        <button class="btn btn-gold"
        onclick="cTab('home',null)">
          Find Barbers →
        </button>

      </div>

    `;

    return;
  }

  const s=S.shops[S.myShopId];

  const ahead=Math.max(0,S.myTok-s.cur);

  const prog=Math.max(
    5,
    Math.round(100-ahead*15)
  );

  el.innerHTML=`

    ${ahead<=2?`

      <div class="notif">

        <span style="font-size:20px">
          🔔
        </span>

        <div>

          <div style="font-weight:500;font-size:14px">
            Almost your turn!
          </div>

          <div style="font-size:12px;color:var(--txt2)">
            ${ahead} customer${ahead!==1?'s':''} ahead of you
          </div>

        </div>

      </div>

    `:''}


    <div style="background:var(--gdim);border:2px solid var(--gold);border-radius:var(--rxl);padding:28px;text-align:center;margin-bottom:18px">

      <div style="font-size:12px;color:var(--txt2);margin-bottom:6px">
        ${s.name}
      </div>

      <div style="font-size:13px;color:var(--txt2);margin-bottom:4px">
        Your Token
      </div>

      <div style="font-size:80px;font-weight:800;font-family:'Syne',sans-serif;color:var(--gold);line-height:1">
        #${S.myTok}
      </div>

      <div style="font-size:14px;color:var(--txt2);margin-top:6px">
        ${S.mySvc}
      </div>

    </div>


    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px">

      <div class="stat"
      style="text-align:center">

        <div class="stat-n"
        style="color:var(--gold)">
          #${s.cur}
        </div>

        <div class="stat-l">
          Serving Now
        </div>

      </div>


      <div class="stat"
      style="text-align:center">

        <div class="stat-n"
        style="color:var(--cyan)">
          ${ahead}
        </div>

        <div class="stat-l">
          Ahead of You
        </div>

      </div>

    </div>


    <div class="stat"
    style="margin-bottom:16px">

      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">

        <span style="color:var(--txt2);font-size:14px">
          Estimated wait
        </span>

        <span style="font-size:20px;font-weight:800;font-family:'Syne',sans-serif;color:var(--gold)">
          ~${s.wait} min
        </span>

      </div>

      <div class="pbar">

        <div class="pfill"
        style="width:${prog}%">
        </div>

      </div>

      <div style="font-size:12px;color:var(--txt2);margin-top:6px;text-align:right">
        Progress to your turn
      </div>

    </div>


    <div style="display:flex;gap:10px">

      <button class="btn btn-red"
      style="flex:1"
      onclick="leaveQ();cTab('queue',null)">
        Leave Queue
      </button>

      <button class="btn btn-outline"
      style="flex:1"
      onclick="openModal('m-rate');document.getElementById('rate-shop-name').textContent='${s.name}'">
        Rate Shop ⭐
      </button>

    </div>

    <div style="height:20px"></div>

  `;
}


function cTab(name,el){

  document.getElementById('cust-home').style.display=
    name==='home'?'block':'none';

  document.getElementById('cust-queue').style.display=
    name==='queue'?'block':'none';

  if(el){

    document.querySelectorAll('#c-tabs .tab')
    .forEach(t=>t.classList.remove('on'));

    el.classList.add('on');
  }

  if(name==='queue')
    renderMyQ();
}


// ═══════ BARBER ═══════
function renderBQ(){

  document.getElementById('b-inq').textContent=
    S.bq.length;

  document.getElementById('b-qlist').innerHTML=

  S.bq.map((q,i)=>`

    <div class="qi ${q.st}"
    style="animation-delay:${i*.04}s">

      <div class="qi-num"
      style="background:${q.st==='cur'?'var(--gdim)':q.st==='nxt'?'var(--cdim)':'var(--s3)'};color:${q.st==='cur'?'var(--gold)':q.st==='nxt'?'var(--cyan)':'var(--txt2)'}">

        ${q.tok}

      </div>

      <div style="flex:1;min-width:0">

        <div style="font-weight:500;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
          ${q.name}
        </div>

        <div style="font-size:12px;color:var(--txt2)">
          ${q.svc} · ${q.dur} min
        </div>

      </div>

      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0">

        ${
          q.st==='cur'
          ?
          `<span class="tag tg pulse">● Now Serving</span>

          <div style="display:flex;gap:6px;margin-top:4px">

            <button class="btn btn-green btn-sm"
            onclick="doneToken()">
              Done ✓
            </button>

            <button class="btn btn-outline btn-sm"
            onclick="skipToken()">
              Skip ⏭
            </button>

          </div>`

          :

          q.st==='nxt'
          ?
          `<span class="tag tgreen">
            Next Up
          </span>`

          :

          `<span style="font-size:12px;color:var(--txt2)">
            ~${q.eta} min
          </span>`
        }

      </div>

    </div>

  `).join('')+

  (
    S.bq.length===0
    ?
    `<div style="text-align:center;padding:40px;color:var(--txt2)">

      <div style="font-size:40px;margin-bottom:10px">
        ✅
      </div>

      <div style="font-size:16px;font-weight:500">
        Queue is clear!
      </div>

    </div>`
    :
    ''
  );
}


function doneToken(){

  if(S.bq.length===0)return;

  const done=S.bq.shift();

  S.doneCnt++;

  const sv=S.services.find(
    s=>s.name===done.svc
  );

  if(sv)
    S.earn+=sv.price;

  document.getElementById('b-done').textContent=
    S.doneCnt;

  document.getElementById('b-earn').textContent=
    '₹'+S.earn.toLocaleString('en-IN');

  if(S.bq.length>0){

    S.bq[0].st='cur';

    if(S.bq.length>1)
      S.bq[1].st='nxt';

  }

  renderBQ();

  toast(
    '✅',
    'Token completed! Calling next customer.'
  );
}


function skipToken(){

  if(S.bq.length<2){

    toast(
      '⚠️',
      'Only one customer in queue'
    );

    return;
  }

  const sk=S.bq.shift();

  sk.st='wait';

  const last=S.bq[S.bq.length-1];

  sk.eta=(last?.eta||10)+sk.dur;

  S.bq.push(sk);

  S.bq[0].st='cur';

  if(S.bq.length>1)
    S.bq[1].st='nxt';

  renderBQ();

  toast(
    '⏭️',
    'Token skipped to end of queue.'
  );
}


const walkinNames=[
  'Vikram R.',
  'Sanjeev P.',
  'Kavya S.',
  'Rohit M.',
  'Meera K.',
  'Arjun D.',
  'Sneha T.'
];

let nextTok=9;


function addDemoCustomer(){

  const sv=
    S.services[
      Math.floor(
        Math.random()*S.services.length
      )
    ];

  const last=
    S.bq[S.bq.length-1];

  const n={
    tok:nextTok++,
    name:
      walkinNames[
        Math.floor(
          Math.random()*walkinNames.length
        )
      ],
    svc:sv.name,
    dur:sv.dur,
    st:'wait',
    eta:(last?.eta||10)+sv.dur
  };

  S.bq.push(n);

  if(S.bq.length===1)
    S.bq[0].st='cur';

  else if(S.bq.length===2)
    S.bq[1].st='nxt';

  renderBQ();

  toast(
    '👋',
    'New customer added to queue!'
  );
}


function toggleShop(){

  S.shopOpen=!S.shopOpen;

  const el=
    document.getElementById('shop-status');

  el.textContent=
    S.shopOpen?'● Open':'● Closed';

  el.className=
    'tag '+(
      S.shopOpen
      ?
      'tgreen pulse'
      :
      'tred'
    );

  toast(
    S.shopOpen?'✅':'⛔',
    S.shopOpen
    ?
    'Shop is now Open for bookings'
    :
    'Shop is now Closed'
  );
}


function renderSvcs(){

  const el=
    document.getElementById('b-svclist');

  if(!el)return;

  el.innerHTML=

  S.services.map((s,i)=>`

    <div style="display:flex;align-items:center;gap:12px;padding:14px;background:var(--s2);border:1px solid var(--b1);border-radius:var(--r);margin-bottom:8px">

      <span style="font-size:28px">
        ${s.ico}
      </span>

      <div style="flex:1">

        <div style="font-weight:500;font-size:14px">
          ${s.name}
        </div>

        <div style="font-size:12px;color:var(--txt2)">
          ~${s.dur} min
        </div>

      </div>

      <div style="color:var(--gold);font-weight:700;font-size:18px;font-family:'Syne',sans-serif;margin-right:8px">
        ₹${s.price}
      </div>

      <button class="btn btn-red btn-sm"
      onclick="delSvc(${i})">
        ✕
      </button>

    </div>

  `).join('');
}


function addSvc(){

  const n=
    document.getElementById('sn').value.trim();

  const p=
    parseInt(
      document.getElementById('sp').value
    );

  const d=
    parseInt(
      document.getElementById('sd').value
    );

  const e=
    document.getElementById('se').value||'💼';

  if(!n||isNaN(p)||isNaN(d)){

    toast(
      '⚠️',
      'Please fill all fields'
    );

    return;
  }

  S.services.push({
    id:S.services.length+1,
    name:n,
    price:p,
    dur:d,
    ico:e
  });

  closeModal('m-svc');

  renderSvcs();

  toast(
    '✅',
    `Service "${n}" added!`
  );

  document.getElementById('sn').value='';
  document.getElementById('sp').value='';
  document.getElementById('sd').value='';
  document.getElementById('se').value='💇';
}


function delSvc(i){

  const n=S.services[i].name;

  S.services.splice(i,1);

  renderSvcs();

  toast(
    '🗑️',
    `"${n}" removed`
  );
}


function renderAnalytics(){

  const el=
    document.getElementById('b-analytics');

  if(!el)return;

  const days=[
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun'
  ];

  const vals=[
    12,
    18,
    9,
    22,
    28,
    35,
    16
  ];

  const mx=Math.max(...vals);

  el.innerHTML=`

    <div class="card card-p"
    style="margin-bottom:14px">

      <div style="font-size:12px;color:var(--txt2);margin-bottom:4px">
        Total Revenue (This Week)
      </div>

      <div style="font-size:34px;font-weight:800;font-family:'Syne',sans-serif;color:var(--gold)">
        ₹12,840
      </div>

      <div style="font-size:13px;color:var(--green);margin-top:4px">
        ↑ 18% from last week
      </div>

    </div>


    <div class="card card-p"
    style="margin-bottom:14px">

      <div style="font-size:15px;font-weight:700;font-family:'Syne',sans-serif;margin-bottom:16px">
        Customers This Week
      </div>

      <div class="abar-wrap">

        ${vals.map((v,i)=>`

          <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px">

            <div class="abar ${i===4?'hi':''}"
            style="height:${Math.round(v/mx*68)}px">
            </div>

            <div class="abar-label">
              ${days[i]}
            </div>

          </div>

        `).join('')}

      </div>

    </div>


    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">

      <div class="stat"
      style="text-align:center">

        <div class="stat-n"
        style="color:var(--green)">
          140
        </div>

        <div class="stat-l">
          Total Clients
        </div>

      </div>


      <div class="stat"
      style="text-align:center">

        <div class="stat-n"
        style="color:var(--gold)">
          4.8★
        </div>

        <div class="stat-l">
          Avg Rating
        </div>

      </div>

    </div>


    <div class="card card-p">

      <div style="font-size:15px;font-weight:700;font-family:'Syne',sans-serif;margin-bottom:14px">
        Top Services
      </div>

      ${S.services.map((s,i)=>{

        const pct=[
          52,
          31,
          8,
          6,
          3
        ][i]||2;

        return`

          <div style="margin-bottom:12px">

            <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px">

              <span>
                ${s.ico} ${s.name}
              </span>

              <span style="color:var(--gold);font-weight:500">
                ${pct}%
              </span>

            </div>

            <div class="pbar">

              <div class="pfill"
              style="width:${pct}%">
              </div>

            </div>

          </div>

        `

      }).join('')}

    </div>

    <div style="height:20px"></div>

  `;
}


function bTab(name,el){

  document.getElementById('b-queue-tab').style.display=
    name==='queue'?'block':'none';

  document.getElementById('b-svc-tab').style.display=
    name==='svc'?'block':'none';

  document.getElementById('b-analytics-tab').style.display=
    name==='analytics'?'block':'none';

  if(el){

    document.querySelectorAll('#b-tabs .tab')
    .forEach(t=>t.classList.remove('on'));

    el.classList.add('on');
  }

  if(name==='svc')
    renderSvcs();

  if(name==='analytics')
    renderAnalytics();
}


// ═══════ PROFILE ═══════
function renderProfile(){

  const isB=S.role==='barber';

  const rows=isB
  ?
  [
    ['📱','Phone','+91 98765 43210'],
    ['🏪','Shop Name','Royal Cuts'],
    ['📍','Address','Hazratganj, Lucknow'],
    ['🕐','Hours','9:00 AM – 8:00 PM'],
    ['⭐','My Rating','4.8 / 5.0']
  ]
  :
  [
    ['📱','Phone','+91 98765 43210'],
    ['📍','Location','Hazratganj, Lucknow'],
    ['🎫','Queue History','12 visits'],
    ['⭐','Shops Rated','4 shops']
  ];

  document.getElementById('prof-body').innerHTML=`

    <div style="text-align:center;padding:24px 0 28px">

      <div class="av"
      style="width:80px;height:80px;margin:0 auto 14px;font-size:30px;background:${isB?'var(--cdim)':'var(--gdim)'};border:3px solid ${isB?'var(--cyan)':'var(--gold)'};color:${isB?'var(--cyan)':'var(--gold)'}">

        ${isB?'R':'A'}

      </div>

      <div style="font-size:22px;font-weight:800;font-family:'Syne',sans-serif">
        ${isB?'Rahul Sharma':'Amit Kumar'}
      </div>

      <div style="color:var(--txt2);font-size:13px;margin-top:4px">
        ${isB?'Royal Cuts · Hazratganj, Lucknow':'+91 98765 43210'}
      </div>

      <span class="tag ${isB?'tgreen':'tg'}"
      style="margin-top:10px">
        ${isB?'Verified Barber':'Customer'}
      </span>

    </div>


    <div style="margin-bottom:20px">

      ${rows.map(([ico,lab,val])=>`

        <div class="prow">

          <div class="prow-ico">
            ${ico}
          </div>

          <div style="flex:1">

            <div class="prow-lab">
              ${lab}
            </div>

            <div class="prow-val">
              ${val}
            </div>

          </div>

          <span style="color:var(--txt2)">
            ›
          </span>

        </div>

      `).join('')}

    </div>


    <div style="display:flex;flex-direction:column;gap:10px">

      <button class="btn btn-outline btn-full"
      onclick="toast('✏️','Edit profile coming soon!')">
        Edit Profile
      </button>

      ${isB?`

        <button class="btn btn-outline btn-full"
        onclick="toast('📷','Shop photo upload coming soon!')">
          Update Shop Photo
        </button>

      `:''}

      <button class="btn btn-red btn-full"
      onclick="logout()">
        Logout
      </button>

      <button class="btn btn-ghost btn-full"
      style="color:var(--red)"
      onclick="toast('⚠️','Account deletion requires email confirmation')">
        Delete Account
      </button>

    </div>

    <div style="height:24px"></div>

  `;
}


function logout(){

  toast(
    '👋',
    'Logged out successfully'
  );

  setTimeout(()=>{

    S.role=null;

    S.inQueue=false;

    go('s-land');

  },600);
}


// ═══════ RATING ═══════
function setStar(n){

  S.rating=n;

  document
    .querySelectorAll('#star-row .star-btn')
    .forEach(
      (b,i)=>{
        b.textContent=i<n?'⭐':'☆'
      }
    );
}

function submitRating(){

  if(!S.rating){

    toast(
      '⚠️',
      'Please select a star rating'
    );

    return;
  }

  closeModal('m-rate');

  toast(
    '⭐',
    `Thanks for rating ${S.rating} star${S.rating!==1?'s':''}!`
  );

  S.rating=0;

  document
    .querySelectorAll('#star-row .star-btn')
    .forEach(
      b=>b.textContent='☆'
    );

  document.getElementById('rate-txt').value='';
}


// ═══════ REAL-TIME SIM ═══════
setInterval(()=>{

  if(
    document.getElementById('s-barb').classList.contains('active') &&
    document.getElementById('b-queue-tab').style.display!=='none' &&
    S.bq.length<9 &&
    Math.random()<0.35
  ){

    addDemoCustomer();

  }

},9000);