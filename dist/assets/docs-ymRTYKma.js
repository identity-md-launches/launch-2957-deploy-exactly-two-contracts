import{a as e,c as t,l as n,n as r,s as i}from"./controls-BHCuqmWb.js";import{F as a,Y as o}from"./discovery-MWoTMWRX.js";/* empty css                 */import{t as s}from"./page-title-B-6VmzfP.js";import{t as c}from"./chessboard-C4z3Svh8.js";function l(n,a){let o=i`${n.toc.map(t=>i`<p class="label docs-group">${t.group}</p><ul>${t.sections.map(t=>i`<li><a class="${e(`docs-link`,{"is-on":t.id===a})}" href="#/docs/${t.id}" data-docs-link="${t.id}">${t.title}</a></li>`)}</ul>`)}`;return i`<div class="docs">
    <nav class="docs-nav" aria-label="Contents"><details class="docs-contents" open data-docs-contents><summary class="label">Contents</summary>${o}</details></nav>
    <article class="docs-body">
      <div class="docs-tools">${r({label:`Copy page as Markdown`,size:`sm`,data:{"docs-copy":``}})}<a class="text-link" href="docs/llms.txt" target="_blank" rel="noopener">llms.txt</a></div>
      <div class="prose">${t(n.html)}</div>
    </article>
  </div>`}function u(e,t,n){let i=(e,t)=>navigator.clipboard?.writeText(e).then(()=>{let e=t.querySelector(`.key-label`)??t,n=e.textContent;e.textContent=`Copied`,setTimeout(()=>{e.textContent=n},1200)},()=>void 0);for(let t of e.querySelectorAll(`.docs-code`))t.insertAdjacentHTML(`beforeend`,r({label:`Copy`,size:`sm`,data:{"code-copy":``}}).value);let a=e.querySelector(`[data-docs-contents]`),o=matchMedia(`(max-width: 900px)`);a&&o.matches&&(a.open=!1);let s=t=>e.querySelectorAll(`[data-docs-link]`).forEach(e=>e.classList.toggle(`is-on`,e.dataset.docsLink===t)),c=(t,n)=>{let r=e.querySelector(`#${CSS.escape(t)}`);r&&(r.scrollIntoView({behavior:n&&!matchMedia(`(prefers-reduced-motion: reduce)`).matches?`smooth`:`auto`}),s(t))},l=e=>{let n=e.target,r=n.closest(`[data-code-copy]`);if(r)return void i(r.closest(`.docs-code`)?.querySelector(`code`)?.textContent??``,r);let s=n.closest(`[data-docs-copy]`);if(s)return void i(t.markdown,s);let l=n.closest(`a[href^="#/docs/"]`);if(!l||e.metaKey||e.ctrlKey||e.shiftKey)return;e.preventDefault();let u=l.getAttribute(`href`).slice(7);history.pushState(null,``,`#/docs/${u}`),a&&o.matches&&(a.open=!1),c(u,!0)};e.addEventListener(`click`,l);let u=[...e.querySelectorAll(`.prose h2[id]`)],d=new IntersectionObserver(e=>{let t=e.filter(e=>e.isIntersecting).sort((e,t)=>e.boundingClientRect.top-t.boundingClientRect.top)[0];t&&s(t.target.id)},{rootMargin:`0px 0px -70% 0px`});return u.forEach(e=>d.observe(e)),n&&requestAnimationFrame(()=>c(n,!1)),()=>{e.removeEventListener(`click`,l),d.disconnect()}}var d=[[`Trade`,`Buy the token of the team you back.`,`A normal buy in the duel’s pool is a bid for its team’s next move. It funds the reward pools and sets a strength from what it receives as a share of its team’s reward pool.`],[`Bid`,`The biggest bid owns the move.`,`A new top bid must pay more than 10% over the current one. Bidding stays open for about 36 seconds after the previous move is played; then the move is fixed.`],[`Move`,`A later trade plays the engine’s move.`,`The hash of the window’s last block supplies the seed, so nobody knows the move while bidding. The next trade, from either team, advances the board. You don’t choose a square.`],[`Prize`,`Checkmate wins the jackpot.`,`In this example Nxe5 takes a pawn and pays nothing. When a move mates, its owner wins what this game paid into the losing team’s reward pool, in the loser’s token: at most a quarter of it and twice what the bid paid.`]],f=()=>i`<div class="walkthrough"><div class="walk-board"></div><div class="walk-body"><span class="label">Example turn / Nxe5</span>
  <div class="walk-steps" role="group" aria-label="Steps in a turn">${d.map(([e],t)=>r({label:`${t+1}. ${e}`,size:`sm`,pressed:t===0,data:{lesson:t}}))}</div>
  <div class="walk-explanation" aria-live="polite"><h3></h3><p></p></div><p class="walk-disclaimer">Illustrated sequence. The live engine chooses its own move.</p></div></div>`;function p(e){let t=new c(e.querySelector(`.walk-board`),`Example turn`),n=0,r=r=>{n=Math.max(0,Math.min(3,r));let i=new o;for(let e of`e4 e5 Nf3 Nc6 Bc4 Nd4`.split(` `))i.move(e);let s=n>=2?i.move(`Nxe5`):void 0,c=e=>`abcdefgh`.indexOf(e[0])+(Number(e[1])-1)*8;t.show({pieces:a(i.fen()),last:s?{from:c(s.from),to:c(s.to)}:void 0}),e.querySelectorAll(`[data-lesson]`).forEach(e=>e.setAttribute(`aria-pressed`,String(Number(e.dataset.lesson)===n))),e.querySelector(`h3`).textContent=d[n][1],e.querySelector(`.walk-explanation p`).textContent=d[n][2]},i=new AbortController;return e.addEventListener(`click`,e=>{let t=e.target.closest(`[data-lesson]`);t&&r(Number(t.dataset.lesson))},{signal:i.signal}),r(0),()=>i.abort()}var m={html:`<h2 id="what-imduel-is"><a class="docs-anchor" href="#/docs/what-imduel-is" aria-label="Link to this section">#</a>What IMDuel is</h2>
<p>IMDuel is chess played by trades. Each duel is a Uniswap v4 pool of two tokens, and the two tokens are the teams. Buying a token bids for its team&#39;s next move. An onchain engine plays the pieces; the trades decide how strongly it plays and who gets paid when it mates.</p>
<ul>
<li>The main duel is <strong>IMDUEL / IMD</strong>. Anyone can open a duel of any token against IMD or IMDUEL.</li>
<li>Every swap in a duel pays a 0.75% fee into the game: most of it fills the two teams&#39; reward pools.</li>
<li>Checkmate pays the owner of the mating move what that game paid into the losing team&#39;s reward pool, in the loser&#39;s token: at most a quarter of it and 2x the bid.</li>
<li>There is no owner, admin key, pause or upgrade. The rules are the contracts.</li>
</ul>
<p>A bigger trade plays a stronger move. It does not guarantee a mate, a win or a profit, and token prices move. Trade only what you can lose.</p>
<h2 id="quick-start"><a class="docs-anchor" href="#/docs/quick-start" aria-label="Link to this section">#</a>Quick start</h2>
<ol>
<li><strong>Connect.</strong> Press Connect in the header and pick your wallet. You need ETH for gas and the token you pay with: in IMDUEL / IMD, IMD buys IMDUEL and IMDUEL buys IMD.</li>
<li><strong>Pick a duel.</strong> Open <a href="#/duels">Duels</a> and choose one. The board shows the live game, whose move it is, both teams&#39; reward pools and what a checkmate pays now.</li>
<li><strong>Buy for a team.</strong> In the Trade panel, choose the team you back and an amount. Buying its token bids for its next move. The panel shows whether your buy takes the top bid and how strong the move would be.</li>
<li><strong>Watch the move.</strong> When the bidding window closes, the move is fixed. The next trade in the pool plays it. If it mates, the prize is recorded for the owner to claim.</li>
<li><strong>Check your activity.</strong> Press your address in the header for your bids, your moves and what you won.</li>
</ol>
<h2 id="how-a-move-works"><a class="docs-anchor" href="#/docs/how-a-move-works" aria-label="Link to this section">#</a>How a move works</h2>
<div data-walkthrough></div><h3 id="every-buy-bids"><a class="docs-anchor" href="#/docs/every-buy-bids" aria-label="Link to this section">#</a>Every buy bids</h3>
<p>A buy of a team&#39;s token is a bid for that team&#39;s next move that isn&#39;t fixed yet: the move being decided, if it is that team&#39;s turn, otherwise the team&#39;s following move. Size doesn&#39;t matter for taking part; there is no minimum. It doesn&#39;t matter which app or aggregator sends the trade. If the game ends before a bid&#39;s move comes up, the bid owns its team&#39;s first move of the next game.</p>
<p>The biggest bid owns the move. To take the top spot, a buy must pay more than 10% over the current top bid. Smaller buys just trade. Both teams&#39; top bids are public onchain, and the Trade panel shows the amount to beat.</p>
<h3 id="the-bidding-window"><a class="docs-anchor" href="#/docs/the-bidding-window" aria-label="Link to this section">#</a>The bidding window</h3>
<p>A move takes bids for 3 blocks after the previous move is played: about 36 seconds on Ethereum. If a window passes with no bid, the first bid that comes opens a new 3-block window, so the team can answer it.</p>
<h3 id="the-dice"><a class="docs-anchor" href="#/docs/the-dice" aria-label="Link to this section">#</a>The dice</h3>
<p>When the window closes, the hash of its last block seeds the engine. That hash didn&#39;t exist while anyone could still bid, so nobody can see the move a bid will play and choose it. Once that block is mined the move is fixed, and the site shows it before it is played.</p>
<h3 id="who-plays-the-move"><a class="docs-anchor" href="#/docs/who-plays-the-move" aria-label="Link to this section">#</a>Who plays the move</h3>
<p>The first trade after the window plays the move, from either team, of any size. Who plays it and when doesn&#39;t change it. That trade also pays the engine&#39;s gas (see <a href="#/docs/gas">Gas</a>).</p>
<h3 id="timeouts"><a class="docs-anchor" href="#/docs/timeouts" aria-label="Link to this section">#</a>Timeouts</h3>
<p>If the side to move gets no bid for 10 minutes, a trade by the other team opens that move at 0% strength, for nobody. A real bid in the same block takes it over. A timeout move that mates pays nobody.</p>
<p>A move whose block hash the chain no longer serves (after 8,191 blocks, about a day) is played at its bid&#39;s strength for nobody, so letting a move expire never helps the bidder.</p>
<h2 id="strength"><a class="docs-anchor" href="#/docs/strength" aria-label="Link to this section">#</a>Strength</h2>
<p>A move&#39;s strength comes from what the owning trade received, as a share of its own team&#39;s reward pool, read when it bids. It reads no liquidity and no price, so nobody can move it except by putting money into the reward pool, and that money goes to the game&#39;s winners. An empty reward pool has nothing to measure against and plays at the cap, so at launch, and after every mate, most moves play strong until the reward pool has grown.</p>
<table>
<thead>
<tr>
<th>Share of the team&#39;s reward pool</th>
<th>Strength</th>
</tr>
</thead>
<tbody><tr>
<td>0.1% or less</td>
<td>0%</td>
</tr>
<tr>
<td>1%</td>
<td>30%</td>
</tr>
<tr>
<td>10%</td>
<td>60%</td>
</tr>
<tr>
<td>The whole reward pool or more</td>
<td>90% (the cap)</td>
</tr>
</tbody></table>
<p>Strength sets how hard the engine looks. At 0% it plays like a beginner who still notices captures and checks. Near the cap it plays like a strong amateur. Every strength keeps some seeded mistakes, more at low strength, so games stay human: even a whale&#39;s move can miss a mate.</p>
<h3 id="the-engine"><a class="docs-anchor" href="#/docs/the-engine" aria-label="Link to this section">#</a>The engine</h3>
<p>The engine runs onchain, inside the trade that plays the move. It scores every legal move for material, position, pressure on the enemy king and the risk it leaves; captures and checks always catch its eye. Higher strength takes more second looks at the leading move. Against a lone king it converts at full effort. The longer a game goes without a capture or pawn move, the more it pushes for progress.</p>
<h2 id="the-prize"><a class="docs-anchor" href="#/docs/the-prize" aria-label="Link to this section">#</a>The prize</h2>
<p>Checkmate wins the jackpot. The move that mates wins what that game&#39;s trades paid into the losing team&#39;s reward pool, at most a quarter of that reward pool as it stands when the move is played, and the prize is recorded for the move&#39;s owner in the loser&#39;s token. Captures, checks and quiet moves pay nothing: the reward pools grow between mates, through draws and timeouts, so a mate is worth about a game&#39;s worth of fees.</p>
<ul>
<li><strong>The winner takes from the loser.</strong> Buying IMDUEL and mating wins IMD; buying IMD and mating wins IMDUEL. The winning team&#39;s own reward pool is untouched.</li>
<li><strong>The caps.</strong> The prize is at most 2x what the mating bid paid, and at most what that game&#39;s trades paid into the losing reward pool (donations don&#39;t count). Every trade puts half its reward pool fee into each reward pool, so any game that saw trading pays. To take a full quarter, a bid must pay at least an eighth of the loser&#39;s reward pool, in a game that paid at least a quarter of it in reward pool fees. A game played for dust pays nothing. The rest stays in the reward pool.</li>
<li><strong>Only the owner.</strong> Only the top bid when the window closed is paid. Outbid trades earn nothing, and a timeout move pays nobody.</li>
<li><strong>The owner is the wallet behind the trade.</strong> Trading here names you. A trade through Uniswap&#39;s own app or an aggregator belongs to the wallet that signed it. See Trade from code.</li>
<li><strong>Claimed, not pushed.</strong> When the mate is played, the prize is recorded for the owner; nothing is sent inside anyone&#39;s trade. Claim it under the duel&#39;s board, in Payouts, or with <code>withdraw</code> from any wallet (it only ever pays the owner); <code>withdrawTo</code> sends it to another address of the owner&#39;s choosing. Prizes wait as long as you like.</li>
<li><strong>Bots are welcome.</strong> A mate in one is visible to everyone, so the mating move is a race for the last bid in the window, and the site shows a mate on the board to everyone. Every bid for it is a buy of at least half the prize.</li>
</ul>
<p>The owner is the address the trade names: the site always sends yours. A trade sent without one (another app or an aggregator) names the wallet that signed it.</p>
<h2 id="games-and-draws"><a class="docs-anchor" href="#/docs/games-and-draws" aria-label="Link to this section">#</a>Games and draws</h2>
<p>A game ends by checkmate or a draw. Then the board resets, colours swap and a new game starts with the next trade. The reward pools carry over between games.</p>
<p>The draws are automatic:</p>
<ul>
<li>stalemate;</li>
<li>too few pieces to mate (two kings, or a king and one knight or bishop against a king);</li>
<li>the third time a position appears, counting it and the positions up to sixteen half-moves earlier (the start position counts from any distance);</li>
<li>60 half-moves without a capture or pawn move;</li>
<li>200 half-moves in total;</li>
<li>the engine failing to answer on a position, twice (it never has).</li>
</ul>
<p>A draw pays nothing: the reward pools wait for the next mate.</p>
<p>In the first game the team of the token people buy plays White: in the main duel, IMDUEL. Colours alternate after that.</p>
<h2 id="fees"><a class="docs-anchor" href="#/docs/fees" aria-label="Link to this section">#</a>Fees</h2>
<p>Every swap in a duel pays:</p>
<ul>
<li><strong>The duel fee: 0.75%.</strong> 0.65% fills the reward pools and 0.1% is the protocol slice, which burns IMDUEL (see <a href="#/docs/imduel">IMDUEL</a>). There is no opening fee and no other charge: a trade in the main duel costs 2% in all before gas and price impact.</li>
<li><strong>The pool fee.</strong> It goes to the pool&#39;s liquidity. In the main duel it is 1.25%: 1% to the launch wallet and 0.25% to the IMD network. Other duels use the fee their creator chose.</li>
<li><strong>Gas.</strong> See <a href="#/docs/gas">Gas</a>.</li>
</ul>
<p>Every swap the hook takes a fee from also emits the standard <code>HookSwap</code> event with that fee, so explorers and indexers count what you really paid (a dust swap whose fee rounds to nothing emits none).</p>
<h2 id="reward-pools"><a class="docs-anchor" href="#/docs/reward-pools" aria-label="Link to this section">#</a>Reward pools</h2>
<p>Each duel has two reward pools, one per team, each in its team&#39;s token.</p>
<ul>
<li>The 0.65% share of every swap fills both reward pools: half from what the trade pays into that token&#39;s reward pool, half from what it buys into the other. Every trade feeds both by about the same value, so they stay balanced.</li>
<li>A duel against IMD adds its slice, in IMD, to the main duel&#39;s IMD reward pool.</li>
<li>Anyone can add to a duel&#39;s reward pool with the hook&#39;s <code>fundChest</code>. It raises what the other team wins by mating that team and, since strength is a share of the reward pool, makes that team&#39;s ordinary bids weaker.</li>
<li>Nothing else takes from a reward pool: only a checkmate&#39;s prize leaves it, and never more than a quarter at a time.</li>
</ul>
<h2 id="imduel"><a class="docs-anchor" href="#/docs/imduel" aria-label="Link to this section">#</a>IMDUEL</h2>
<p>IMDUEL is the main duel&#39;s token. The IMD swarm launches it together with the hook, paired with IMD.</p>
<h3 id="supply"><a class="docs-anchor" href="#/docs/supply" aria-label="Link to this section">#</a>Supply</h3>
<p>1,000,000,000 IMDUEL, fixed, with plain transfers. At launch:</p>
<table>
<thead>
<tr>
<th>Share</th>
<th>Goes to</th>
</tr>
</thead>
<tbody><tr>
<td>80%</td>
<td>The pool, single-sided: everyone buys from it</td>
</tr>
<tr>
<td>8%</td>
<td>IMD seats connected at launch, shared equally (the swarm&#39;s airdrop)</td>
</tr>
<tr>
<td>2%</td>
<td>Wallets that work on the launch (the swarm&#39;s airdrop)</td>
</tr>
<tr>
<td>10%</td>
<td>The launch wallet <code>0x6AA3…5B23</code>, unlocked: 5% the team, 5% reserved for the Robinhood Chain duel</td>
</tr>
</tbody></table>
<h3 id="burn"><a class="docs-anchor" href="#/docs/burn" aria-label="Link to this section">#</a>Burn</h3>
<p>The 0.1% slice is taken without any swap. Wherever a duel holds IMDUEL (the main duel always), it is taken in IMDUEL and burned. A duel against IMD takes its slice in IMD, into the main duel&#39;s IMD reward pool. The burn is owed to <code>0x…dEaD</code> and anyone can send it with the hook&#39;s <code>withdraw(0x…dEaD, IMDUEL)</code>. The hook reads no prices, so no trade can move what it does.</p>
<h2 id="gas"><a class="docs-anchor" href="#/docs/gas" aria-label="Link to this section">#</a>Gas</h2>
<table>
<thead>
<tr>
<th>Trade</th>
<th>Typical gas</th>
</tr>
</thead>
<tbody><tr>
<td>A plain trade</td>
<td>about 180,000</td>
</tr>
<tr>
<td>A trade that plays a move</td>
<td>about 530,000; usually 350,000 to 650,000, rare positions more</td>
</tr>
</tbody></table>
<p>The trade that plays a move runs the engine, so it costs more, whoever sends it. This site sends every trade with a gas limit of 5,000,000; you only pay for the gas used. Other apps estimate gas when you confirm: if a window closes between that estimate and the block your trade lands in, the trade has to play the move and can run out of gas. It then reverts with <code>NotEnoughGas</code> rather than play a weaker move; only the gas is spent, send it again with a higher limit.</p>
<h2 id="trading"><a class="docs-anchor" href="#/docs/trading" aria-label="Link to this section">#</a>Trading</h2>
<p>The site trades through Uniswap&#39;s own contracts: the Universal Router and Permit2.</p>
<ol>
<li><strong>Approve, once per token.</strong> A transaction that lets Permit2 move that token.</li>
<li><strong>Sign a permit.</strong> No gas. It gives the router a limited allowance for this amount, for a short time. Skipped while an earlier allowance still covers the trade.</li>
<li><strong>Send the trade.</strong> One transaction; the permit travels inside it.</li>
</ol>
<p><strong>Slippage.</strong> Auto allows 0.5% plus the largest price move seen within a block in this pool lately, at most 5%. Bids for the same move buy the same token, so trades earlier in your block move your price. Whatever you allow is also what a bot trading around yours could take.</p>
<h2 id="liquidity"><a class="docs-anchor" href="#/docs/liquidity" aria-label="Link to this section">#</a>Liquidity</h2>
<p>The Pool switch on a duel&#39;s panel adds liquidity to its Uniswap pool. Liquidity earns the pool fee, shared by size; the 0.75% duel fee is separate and goes to the game. The position is a Uniswap position NFT in your wallet. Liquidity has no effect on anyone&#39;s strength or prize.</p>
<h2 id="your-profile"><a class="docs-anchor" href="#/docs/your-profile" aria-label="Link to this section">#</a>Your profile</h2>
<p>The wallet drawer&#39;s Profile key opens <code>#/profile/0x…</code>: the counts the hook keeps for an address in the main duel (games, checkmates, moves by piece, pieces taken, checks, castles, promotions, moves at full strength, the rare ones, the amounts won) and the badges they earn. Any address can be looked up; press one anywhere on the site to open its profile, or rest on it for a card. Side duels count nothing.</p>
<p>The <a href="#/leaderboard">Leaderboard</a> ranks every player of the main duel by badges, checkmates, moves, pieces taken or games. Badges are computed from the hook&#39;s counts and are not minted.</p>
<h2 id="create-a-duel"><a class="docs-anchor" href="#/docs/create-a-duel" aria-label="Link to this section">#</a>Create a duel</h2>
<p><a href="#/create">Create a duel</a> for any ERC-20, or ETH, against IMD or IMDUEL. It is free: you pay gas and the initial liquidity, which stays yours.</p>
<ul>
<li>Pick the token, the pair and the pool fee.</li>
<li>Set the initial deposits: they set the opening price.</li>
<li>If that exact pool already exists, the site opens it instead.</li>
</ul>
<p>A new duel pays the same fee from its first trade. It must pair with IMD or IMDUEL, so its slice has a main duel reward pool to go to; the hook refuses any other pair.</p>
<h2 id="withdraw"><a class="docs-anchor" href="#/docs/withdraw" aria-label="Link to this section">#</a>Withdraw</h2>
<p>A prize is recorded for its owner when the mate is played, never sent inside a trade. Payouts, under the duel&#39;s board, shows what is yours with a Withdraw key. Anyone can trigger a withdrawal, but it only ever pays the owner; <code>withdrawTo</code> lets the owner name another address. A claim leaves 1 wei behind on purpose (it makes your next prize cheaper to record); the site treats it as nothing.</p>
<h2 id="contracts"><a class="docs-anchor" href="#/docs/contracts" aria-label="Link to this section">#</a>Contracts</h2>
<table>
<thead>
<tr>
<th>Contract</th>
<th>Address</th>
</tr>
</thead>
<tbody><tr>
<td>IMDuelHook</td>
<td><a href="https://etherscan.io/address/0xA92F72DcDd90229C32F6d51229F4cc5c916410CC"><code>0xA92F72DcDd90229C32F6d51229F4cc5c916410CC</code></a></td>
</tr>
<tr>
<td>ChessEngineV5</td>
<td><a href="https://etherscan.io/address/0xc21788F704a8b9456f7391A01d8a3D95Be215a27"><code>0xc21788F704a8b9456f7391A01d8a3D95Be215a27</code></a></td>
</tr>
<tr>
<td>IMDUEL</td>
<td><a href="https://etherscan.io/address/0xc012b8Db13C57beCd950eEfB70540e6f973A3C73"><code>0xc012b8Db13C57beCd950eEfB70540e6f973A3C73</code></a></td>
</tr>
<tr>
<td>Main duel (pool id)</td>
<td><code>0xbb45eacf50b4bd8ce31e0620e14ff6e6b6375d56fce4372d3046f4a02faeae65</code></td>
</tr>
<tr>
<td>Launch</td>
<td>IMD launch 2843, <a href="https://explorer.imd.fun/jobs/4098dafa-99b4-4c9f-97e3-430b49ea6afa">job 4098dafa</a>, block 26,322,077</td>
</tr>
<tr>
<td>Swarm audits</td>
<td><a href="https://explorer.imd.fun/jobs/74895075-9f30-49e2-8c89-ec79383f8102">74895075</a> (this code: 1 low fixed, 1 info documented), <a href="https://explorer.imd.fun/jobs/6acefe89-1311-462a-8f78-5697050c327d">6acefe89</a> (earlier version, every finding fixed)</td>
</tr>
<tr>
<td>Launch wallet (10% team supply: 5% the team, 5% reserved for the Robinhood Chain duel; 1% pool fee)</td>
<td><code>0x6AA302EFf055259c9Cf177f33Ae3cBA5d4135B23</code></td>
</tr>
</tbody></table>
<p>The source as deployed: <a href="https://github.com/identity-md-launches/launch-2843-launch-imduel-imduel-launch-json">the swarm&#39;s launch repository</a>. The hook takes no admin calls; the engine holds no state and no funds.</p>
<p>IMD launch 2666 (hook <code>0x306d011c30094d1098BFD43b105B015Fb9AB10CC</code>, token <code>0xbe481aE624F87f0e991d4481CF6B3ABD3278d29e</code>) was the rehearsal: its hook paid nobody for a trade that didn&#39;t name an owner, so it was redone. That token is not IMDUEL.</p>
<h2 id="read-a-duel"><a class="docs-anchor" href="#/docs/read-a-duel" aria-label="Link to this section">#</a>Read a duel</h2>
<p>A duel is identified by its Uniswap pool ID.</p>
<table>
<thead>
<tr>
<th>Read</th>
<th>Returns</th>
</tr>
</thead>
<tbody><tr>
<td><code>game(poolId)</code></td>
<td>the board, the side to move, both top bids, the bidding window and the last move</td>
</tr>
<tr>
<td><code>chest(poolId, team)</code></td>
<td>a team&#39;s reward pool (team 0 is <code>currency0</code>&#39;s)</td>
</tr>
<tr>
<td><code>previewMove(poolId, hash)</code></td>
<td>the move a closed window will play, given its last block&#39;s hash</td>
</tr>
<tr>
<td><code>owed(owner, currencyId)</code></td>
<td>prizes waiting to be claimed</td>
</tr>
<tr>
<td><code>MATE_SHARE_BPS</code>, <code>PAYOUT_CAP</code>, <code>MATE_INFLOW_CAP</code></td>
<td>the mate&#39;s share of the loser&#39;s reward pool (2,500: a quarter) and its caps (2x what the bid paid, 1x what that game&#39;s trades paid into the losing reward pool)</td>
</tr>
<tr>
<td><code>gameInflow(poolId, gameNo)</code></td>
<td>what a game&#39;s trading paid into each reward pool</td>
</tr>
<tr>
<td><code>stats(address)</code></td>
<td>a player&#39;s counts in the main duel, two packed words (moves by piece, captures, checks, mates, games, amounts won; for badges and display only; side duels count nothing)</td>
</tr>
<tr>
<td><code>players(i)</code>, <code>playerCount()</code></td>
<td>every address that has owned a played move in the main duel</td>
</tr>
</tbody></table>
<p>Events: <code>GameStarted</code>, <code>Bid</code>, <code>Moved</code>, <code>MatePaid</code>, <code>GameOver</code>, <code>DrawTriggered</code>, <code>EngineFailed</code>, <code>Withdrawn</code>, <code>ChestFunded</code>, <code>MainDuel</code>, <code>HookSwap</code>.</p>
<h2 id="trade-from-code"><a class="docs-anchor" href="#/docs/trade-from-code" aria-label="Link to this section">#</a>Trade from code</h2>
<p>Any router or aggregator can trade a duel; every buy bids. The owner is the address in <code>hookData</code>, 20 bytes packed or 32 bytes ABI-encoded; without one it is the wallet that signed the transaction, so a trade from Uniswap&#39;s app or an aggregator earns too. Pass it for a smart-contract wallet or a relayed trade, where the signer is not the trader.</p>
<pre class="docs-code"><code>hookData = abi.encodePacked(owner)   // 20 bytes
hookData = abi.encode(owner)         // 32 bytes</code></pre>
<p>Send every trade with a gas limit of at least 5,000,000: a trade that plays a move must have the engine&#39;s full 3,000,000 cap on hand when it calls it, or it reverts with <code>NotEnoughGas</code>. Unused gas isn&#39;t charged. A window can close between your estimate and your block, and the first trade after it plays the move.</p>
<h2 id="security"><a class="docs-anchor" href="#/docs/security" aria-label="Link to this section">#</a>Security</h2>
<ul>
<li>No owner, admin, pause or upgrade path. The hook and the engine are immutable.</li>
<li>The books are checked by invariant tests and symbolic proofs: what the hook holds equals the reward pools, the burn owed and what is owed, in every currency, and a mate takes exactly the smallest of a quarter of the loser&#39;s reward pool, twice what the bid paid and what that game paid into the losing reward pool; the invariant runs queue mates, so payouts are checked in every run.</li>
<li>Audited by the IMD swarm twice (see <a href="#/docs/contracts">Contracts</a>) and checked by our own reviews, fuzzing (Foundry and Echidna) and a launch rehearsed on a fork of Ethereum.</li>
<li>An engine failure never breaks a trade: a seeded legal move plays at 0% instead, and if that fails too the game ends as a draw and a new one starts.</li>
<li>A hostile token in one duel can only affect that duel.</li>
</ul>
<h2 id="known-limits"><a class="docs-anchor" href="#/docs/known-limits" aria-label="Link to this section">#</a>Known limits</h2>
<ul>
<li><strong>Block builders.</strong> Whoever builds a window&#39;s last block can bid in it and try versions of it, keeping the hash whose move pays. It is worth it only for a large prize, and a mate pays at most 2x what the bid paid.</li>
<li><strong>Reorganisations.</strong> A move is fixed once its window&#39;s last block is in. If the chain replaced that block (rare on Ethereum), the move would change with it.</li>
<li><strong>The last block.</strong> A raise in a window&#39;s last block can&#39;t be answered (a move&#39;s first bid there opens a new window). A mate in one is visible to anyone running an engine, so bots bid for it late; their bids are buys.</li>
<li><strong>Empty reward pools.</strong> Strength is a share of the reward pool, so while a reward pool is small every bid plays near the cap, and a big donation to a reward pool makes that team&#39;s ordinary bids weaker.</li>
<li><strong>Throwing games.</strong> A team can lose on purpose, but every move costs fees and the prize comes out of its own reward pool, so it loses money doing it.</li>
<li><strong>Owner without hookData.</strong> A trade relayed for a smart-contract wallet without the owner in <code>hookData</code> credits the wallet that signed the transaction, not the trader.</li>
</ul>
<h2 id="glossary"><a class="docs-anchor" href="#/docs/glossary" aria-label="Link to this section">#</a>Glossary</h2>
<table>
<thead>
<tr>
<th>Term</th>
<th>Meaning</th>
</tr>
</thead>
<tbody><tr>
<td>Duel</td>
<td>A Uniswap v4 pool on the IMDuel hook; its two tokens are the teams</td>
</tr>
<tr>
<td>Top bid</td>
<td>The biggest buy for a team&#39;s next move; it owns the move</td>
</tr>
<tr>
<td>Owner</td>
<td>The address the top bid named; it receives the prize if its move mates</td>
</tr>
<tr>
<td>Window</td>
<td>The blocks a move takes bids for</td>
</tr>
<tr>
<td>Strength</td>
<td>How hard the engine looks, from the bid&#39;s share of its team&#39;s reward pool</td>
</tr>
<tr>
<td>Reward pool</td>
<td>A team&#39;s prize money, in its token; a checkmate against the team takes up to a quarter of it</td>
</tr>
<tr>
<td>Timeout move</td>
<td>A 0% move for nobody after 10 minutes without a bid</td>
</tr>
<tr>
<td>Slice</td>
<td>The 0.1% of every swap: in IMDUEL, burned; in a duel against IMD, IMD to the main duel&#39;s IMD reward pool</td>
</tr>
</tbody></table>
`,markdown:`# IMDuel docs

<!-- group: Start -->

## What IMDuel is

IMDuel is chess played by trades. Each duel is a Uniswap v4 pool of two tokens, and the two tokens are the teams. Buying a token bids for its team's next move. An onchain engine plays the pieces; the trades decide how strongly it plays and who gets paid when it mates.

- The main duel is **IMDUEL / IMD**. Anyone can open a duel of any token against IMD or IMDUEL.
- Every swap in a duel pays a 0.75% fee into the game: most of it fills the two teams' reward pools.
- Checkmate pays the owner of the mating move what that game paid into the losing team's reward pool, in the loser's token: at most a quarter of it and 2x the bid.
- There is no owner, admin key, pause or upgrade. The rules are the contracts.

A bigger trade plays a stronger move. It does not guarantee a mate, a win or a profit, and token prices move. Trade only what you can lose.

## Quick start

1. **Connect.** Press Connect in the header and pick your wallet. You need ETH for gas and the token you pay with: in IMDUEL / IMD, IMD buys IMDUEL and IMDUEL buys IMD.
2. **Pick a duel.** Open [Duels](#/duels) and choose one. The board shows the live game, whose move it is, both teams' reward pools and what a checkmate pays now.
3. **Buy for a team.** In the Trade panel, choose the team you back and an amount. Buying its token bids for its next move. The panel shows whether your buy takes the top bid and how strong the move would be.
4. **Watch the move.** When the bidding window closes, the move is fixed. The next trade in the pool plays it. If it mates, the prize is recorded for the owner to claim.
5. **Check your activity.** Press your address in the header for your bids, your moves and what you won.

<!-- group: Play -->

## How a move works

<div data-walkthrough></div>

### Every buy bids

A buy of a team's token is a bid for that team's next move that isn't fixed yet: the move being decided, if it is that team's turn, otherwise the team's following move. Size doesn't matter for taking part; there is no minimum. It doesn't matter which app or aggregator sends the trade. If the game ends before a bid's move comes up, the bid owns its team's first move of the next game.

The biggest bid owns the move. To take the top spot, a buy must pay more than 10% over the current top bid. Smaller buys just trade. Both teams' top bids are public onchain, and the Trade panel shows the amount to beat.

### The bidding window

A move takes bids for 3 blocks after the previous move is played: about 36 seconds on Ethereum. If a window passes with no bid, the first bid that comes opens a new 3-block window, so the team can answer it.

### The dice

When the window closes, the hash of its last block seeds the engine. That hash didn't exist while anyone could still bid, so nobody can see the move a bid will play and choose it. Once that block is mined the move is fixed, and the site shows it before it is played.

### Who plays the move

The first trade after the window plays the move, from either team, of any size. Who plays it and when doesn't change it. That trade also pays the engine's gas (see [Gas](#/docs/gas)).

### Timeouts

If the side to move gets no bid for 10 minutes, a trade by the other team opens that move at 0% strength, for nobody. A real bid in the same block takes it over. A timeout move that mates pays nobody.

A move whose block hash the chain no longer serves (after 8,191 blocks, about a day) is played at its bid's strength for nobody, so letting a move expire never helps the bidder.

## Strength

A move's strength comes from what the owning trade received, as a share of its own team's reward pool, read when it bids. It reads no liquidity and no price, so nobody can move it except by putting money into the reward pool, and that money goes to the game's winners. An empty reward pool has nothing to measure against and plays at the cap, so at launch, and after every mate, most moves play strong until the reward pool has grown.

| Share of the team's reward pool | Strength |
| --- | --- |
| 0.1% or less | 0% |
| 1% | 30% |
| 10% | 60% |
| The whole reward pool or more | 90% (the cap) |

Strength sets how hard the engine looks. At 0% it plays like a beginner who still notices captures and checks. Near the cap it plays like a strong amateur. Every strength keeps some seeded mistakes, more at low strength, so games stay human: even a whale's move can miss a mate.

### The engine

The engine runs onchain, inside the trade that plays the move. It scores every legal move for material, position, pressure on the enemy king and the risk it leaves; captures and checks always catch its eye. Higher strength takes more second looks at the leading move. Against a lone king it converts at full effort. The longer a game goes without a capture or pawn move, the more it pushes for progress.

## The prize

Checkmate wins the jackpot. The move that mates wins what that game's trades paid into the losing team's reward pool, at most a quarter of that reward pool as it stands when the move is played, and the prize is recorded for the move's owner in the loser's token. Captures, checks and quiet moves pay nothing: the reward pools grow between mates, through draws and timeouts, so a mate is worth about a game's worth of fees.

- **The winner takes from the loser.** Buying IMDUEL and mating wins IMD; buying IMD and mating wins IMDUEL. The winning team's own reward pool is untouched.
- **The caps.** The prize is at most 2x what the mating bid paid, and at most what that game's trades paid into the losing reward pool (donations don't count). Every trade puts half its reward pool fee into each reward pool, so any game that saw trading pays. To take a full quarter, a bid must pay at least an eighth of the loser's reward pool, in a game that paid at least a quarter of it in reward pool fees. A game played for dust pays nothing. The rest stays in the reward pool.
- **Only the owner.** Only the top bid when the window closed is paid. Outbid trades earn nothing, and a timeout move pays nobody.
- **The owner is the wallet behind the trade.** Trading here names you. A trade through Uniswap's own app or an aggregator belongs to the wallet that signed it. See Trade from code.
- **Claimed, not pushed.** When the mate is played, the prize is recorded for the owner; nothing is sent inside anyone's trade. Claim it under the duel's board, in Payouts, or with \`withdraw\` from any wallet (it only ever pays the owner); \`withdrawTo\` sends it to another address of the owner's choosing. Prizes wait as long as you like.
- **Bots are welcome.** A mate in one is visible to everyone, so the mating move is a race for the last bid in the window, and the site shows a mate on the board to everyone. Every bid for it is a buy of at least half the prize.

The owner is the address the trade names: the site always sends yours. A trade sent without one (another app or an aggregator) names the wallet that signed it.

## Games and draws

A game ends by checkmate or a draw. Then the board resets, colours swap and a new game starts with the next trade. The reward pools carry over between games.

The draws are automatic:

- stalemate;
- too few pieces to mate (two kings, or a king and one knight or bishop against a king);
- the third time a position appears, counting it and the positions up to sixteen half-moves earlier (the start position counts from any distance);
- 60 half-moves without a capture or pawn move;
- 200 half-moves in total;
- the engine failing to answer on a position, twice (it never has).

A draw pays nothing: the reward pools wait for the next mate.

In the first game the team of the token people buy plays White: in the main duel, IMDUEL. Colours alternate after that.

<!-- group: Money -->

## Fees

Every swap in a duel pays:

- **The duel fee: 0.75%.** 0.65% fills the reward pools and 0.1% is the protocol slice, which burns IMDUEL (see [IMDUEL](#/docs/imduel)). There is no opening fee and no other charge: a trade in the main duel costs 2% in all before gas and price impact.
- **The pool fee.** It goes to the pool's liquidity. In the main duel it is 1.25%: 1% to the launch wallet and 0.25% to the IMD network. Other duels use the fee their creator chose.
- **Gas.** See [Gas](#/docs/gas).

Every swap the hook takes a fee from also emits the standard \`HookSwap\` event with that fee, so explorers and indexers count what you really paid (a dust swap whose fee rounds to nothing emits none).

## Reward pools

Each duel has two reward pools, one per team, each in its team's token.

- The 0.65% share of every swap fills both reward pools: half from what the trade pays into that token's reward pool, half from what it buys into the other. Every trade feeds both by about the same value, so they stay balanced.
- A duel against IMD adds its slice, in IMD, to the main duel's IMD reward pool.
- Anyone can add to a duel's reward pool with the hook's \`fundChest\`. It raises what the other team wins by mating that team and, since strength is a share of the reward pool, makes that team's ordinary bids weaker.
- Nothing else takes from a reward pool: only a checkmate's prize leaves it, and never more than a quarter at a time.

## IMDUEL

IMDUEL is the main duel's token. The IMD swarm launches it together with the hook, paired with IMD.

### Supply

1,000,000,000 IMDUEL, fixed, with plain transfers. At launch:

| Share | Goes to |
| --- | --- |
| 80% | The pool, single-sided: everyone buys from it |
| 8% | IMD seats connected at launch, shared equally (the swarm's airdrop) |
| 2% | Wallets that work on the launch (the swarm's airdrop) |
| 10% | The launch wallet \`0x6AA3…5B23\`, unlocked: 5% the team, 5% reserved for the Robinhood Chain duel |

### Burn

The 0.1% slice is taken without any swap. Wherever a duel holds IMDUEL (the main duel always), it is taken in IMDUEL and burned. A duel against IMD takes its slice in IMD, into the main duel's IMD reward pool. The burn is owed to \`0x…dEaD\` and anyone can send it with the hook's \`withdraw(0x…dEaD, IMDUEL)\`. The hook reads no prices, so no trade can move what it does.

## Gas

| Trade | Typical gas |
| --- | --- |
| A plain trade | about 180,000 |
| A trade that plays a move | about 530,000; usually 350,000 to 650,000, rare positions more |

The trade that plays a move runs the engine, so it costs more, whoever sends it. This site sends every trade with a gas limit of 5,000,000; you only pay for the gas used. Other apps estimate gas when you confirm: if a window closes between that estimate and the block your trade lands in, the trade has to play the move and can run out of gas. It then reverts with \`NotEnoughGas\` rather than play a weaker move; only the gas is spent, send it again with a higher limit.

<!-- group: Using the site -->

## Trading

The site trades through Uniswap's own contracts: the Universal Router and Permit2.

1. **Approve, once per token.** A transaction that lets Permit2 move that token.
2. **Sign a permit.** No gas. It gives the router a limited allowance for this amount, for a short time. Skipped while an earlier allowance still covers the trade.
3. **Send the trade.** One transaction; the permit travels inside it.

**Slippage.** Auto allows 0.5% plus the largest price move seen within a block in this pool lately, at most 5%. Bids for the same move buy the same token, so trades earlier in your block move your price. Whatever you allow is also what a bot trading around yours could take.

## Liquidity

The Pool switch on a duel's panel adds liquidity to its Uniswap pool. Liquidity earns the pool fee, shared by size; the 0.75% duel fee is separate and goes to the game. The position is a Uniswap position NFT in your wallet. Liquidity has no effect on anyone's strength or prize.

## Your profile

The wallet drawer's Profile key opens \`#/profile/0x…\`: the counts the hook keeps for an address in the main duel (games, checkmates, moves by piece, pieces taken, checks, castles, promotions, moves at full strength, the rare ones, the amounts won) and the badges they earn. Any address can be looked up; press one anywhere on the site to open its profile, or rest on it for a card. Side duels count nothing.

The [Leaderboard](#/leaderboard) ranks every player of the main duel by badges, checkmates, moves, pieces taken or games. Badges are computed from the hook's counts and are not minted.

## Create a duel

[Create a duel](#/create) for any ERC-20, or ETH, against IMD or IMDUEL. It is free: you pay gas and the initial liquidity, which stays yours.

- Pick the token, the pair and the pool fee.
- Set the initial deposits: they set the opening price.
- If that exact pool already exists, the site opens it instead.

A new duel pays the same fee from its first trade. It must pair with IMD or IMDUEL, so its slice has a main duel reward pool to go to; the hook refuses any other pair.

## Withdraw

A prize is recorded for its owner when the mate is played, never sent inside a trade. Payouts, under the duel's board, shows what is yours with a Withdraw key. Anyone can trigger a withdrawal, but it only ever pays the owner; \`withdrawTo\` lets the owner name another address. A claim leaves 1 wei behind on purpose (it makes your next prize cheaper to record); the site treats it as nothing.

<!-- group: Build -->

## Contracts

| Contract | Address |
| --- | --- |
| IMDuelHook | [\`0xA92F72DcDd90229C32F6d51229F4cc5c916410CC\`](https://etherscan.io/address/0xA92F72DcDd90229C32F6d51229F4cc5c916410CC) |
| ChessEngineV5 | [\`0xc21788F704a8b9456f7391A01d8a3D95Be215a27\`](https://etherscan.io/address/0xc21788F704a8b9456f7391A01d8a3D95Be215a27) |
| IMDUEL | [\`0xc012b8Db13C57beCd950eEfB70540e6f973A3C73\`](https://etherscan.io/address/0xc012b8Db13C57beCd950eEfB70540e6f973A3C73) |
| Main duel (pool id) | \`0xbb45eacf50b4bd8ce31e0620e14ff6e6b6375d56fce4372d3046f4a02faeae65\` |
| Launch | IMD launch 2843, [job 4098dafa](https://explorer.imd.fun/jobs/4098dafa-99b4-4c9f-97e3-430b49ea6afa), block 26,322,077 |
| Swarm audits | [74895075](https://explorer.imd.fun/jobs/74895075-9f30-49e2-8c89-ec79383f8102) (this code: 1 low fixed, 1 info documented), [6acefe89](https://explorer.imd.fun/jobs/6acefe89-1311-462a-8f78-5697050c327d) (earlier version, every finding fixed) |
| Launch wallet (10% team supply: 5% the team, 5% reserved for the Robinhood Chain duel; 1% pool fee) | \`0x6AA302EFf055259c9Cf177f33Ae3cBA5d4135B23\` |

The source as deployed: [the swarm's launch repository](https://github.com/identity-md-launches/launch-2843-launch-imduel-imduel-launch-json). The hook takes no admin calls; the engine holds no state and no funds.

IMD launch 2666 (hook \`0x306d011c30094d1098BFD43b105B015Fb9AB10CC\`, token \`0xbe481aE624F87f0e991d4481CF6B3ABD3278d29e\`) was the rehearsal: its hook paid nobody for a trade that didn't name an owner, so it was redone. That token is not IMDUEL.

## Read a duel

A duel is identified by its Uniswap pool ID.

| Read | Returns |
| --- | --- |
| \`game(poolId)\` | the board, the side to move, both top bids, the bidding window and the last move |
| \`chest(poolId, team)\` | a team's reward pool (team 0 is \`currency0\`'s) |
| \`previewMove(poolId, hash)\` | the move a closed window will play, given its last block's hash |
| \`owed(owner, currencyId)\` | prizes waiting to be claimed |
| \`MATE_SHARE_BPS\`, \`PAYOUT_CAP\`, \`MATE_INFLOW_CAP\` | the mate's share of the loser's reward pool (2,500: a quarter) and its caps (2x what the bid paid, 1x what that game's trades paid into the losing reward pool) |
| \`gameInflow(poolId, gameNo)\` | what a game's trading paid into each reward pool |
| \`stats(address)\` | a player's counts in the main duel, two packed words (moves by piece, captures, checks, mates, games, amounts won; for badges and display only; side duels count nothing) |
| \`players(i)\`, \`playerCount()\` | every address that has owned a played move in the main duel |

Events: \`GameStarted\`, \`Bid\`, \`Moved\`, \`MatePaid\`, \`GameOver\`, \`DrawTriggered\`, \`EngineFailed\`, \`Withdrawn\`, \`ChestFunded\`, \`MainDuel\`, \`HookSwap\`.

## Trade from code

Any router or aggregator can trade a duel; every buy bids. The owner is the address in \`hookData\`, 20 bytes packed or 32 bytes ABI-encoded; without one it is the wallet that signed the transaction, so a trade from Uniswap's app or an aggregator earns too. Pass it for a smart-contract wallet or a relayed trade, where the signer is not the trader.

\`\`\`
hookData = abi.encodePacked(owner)   // 20 bytes
hookData = abi.encode(owner)         // 32 bytes
\`\`\`

Send every trade with a gas limit of at least 5,000,000: a trade that plays a move must have the engine's full 3,000,000 cap on hand when it calls it, or it reverts with \`NotEnoughGas\`. Unused gas isn't charged. A window can close between your estimate and your block, and the first trade after it plays the move.

<!-- group: Trust -->

## Security

- No owner, admin, pause or upgrade path. The hook and the engine are immutable.
- The books are checked by invariant tests and symbolic proofs: what the hook holds equals the reward pools, the burn owed and what is owed, in every currency, and a mate takes exactly the smallest of a quarter of the loser's reward pool, twice what the bid paid and what that game paid into the losing reward pool; the invariant runs queue mates, so payouts are checked in every run.
- Audited by the IMD swarm twice (see [Contracts](#/docs/contracts)) and checked by our own reviews, fuzzing (Foundry and Echidna) and a launch rehearsed on a fork of Ethereum.
- An engine failure never breaks a trade: a seeded legal move plays at 0% instead, and if that fails too the game ends as a draw and a new one starts.
- A hostile token in one duel can only affect that duel.

## Known limits

- **Block builders.** Whoever builds a window's last block can bid in it and try versions of it, keeping the hash whose move pays. It is worth it only for a large prize, and a mate pays at most 2x what the bid paid.
- **Reorganisations.** A move is fixed once its window's last block is in. If the chain replaced that block (rare on Ethereum), the move would change with it.
- **The last block.** A raise in a window's last block can't be answered (a move's first bid there opens a new window). A mate in one is visible to anyone running an engine, so bots bid for it late; their bids are buys.
- **Empty reward pools.** Strength is a share of the reward pool, so while a reward pool is small every bid plays near the cap, and a big donation to a reward pool makes that team's ordinary bids weaker.
- **Throwing games.** A team can lose on purpose, but every move costs fees and the prize comes out of its own reward pool, so it loses money doing it.
- **Owner without hookData.** A trade relayed for a smart-contract wallet without the owner in \`hookData\` credits the wallet that signed the transaction, not the trader.

## Glossary

| Term | Meaning |
| --- | --- |
| Duel | A Uniswap v4 pool on the IMDuel hook; its two tokens are the teams |
| Top bid | The biggest buy for a team's next move; it owns the move |
| Owner | The address the top bid named; it receives the prize if its move mates |
| Window | The blocks a move takes bids for |
| Strength | How hard the engine looks, from the bid's share of its team's reward pool |
| Reward pool | A team's prize money, in its token; a checkmate against the team takes up to a quarter of it |
| Timeout move | A 0% move for nobody after 10 minutes without a bid |
| Slice | The 0.1% of every swap: in IMDUEL, burned; in a duel against IMD, IMD to the main duel's IMD reward pool |
`,toc:[{group:`Start`,sections:[{id:`what-imduel-is`,title:`What IMDuel is`,sub:[]},{id:`quick-start`,title:`Quick start`,sub:[]}]},{group:`Play`,sections:[{id:`how-a-move-works`,title:`How a move works`,sub:[{id:`every-buy-bids`,title:`Every buy bids`},{id:`the-bidding-window`,title:`The bidding window`},{id:`the-dice`,title:`The dice`},{id:`who-plays-the-move`,title:`Who plays the move`},{id:`timeouts`,title:`Timeouts`}]},{id:`strength`,title:`Strength`,sub:[{id:`the-engine`,title:`The engine`}]},{id:`the-prize`,title:`The prize`,sub:[]},{id:`games-and-draws`,title:`Games and draws`,sub:[]}]},{group:`Money`,sections:[{id:`fees`,title:`Fees`,sub:[]},{id:`reward-pools`,title:`Reward pools`,sub:[]},{id:`imduel`,title:`IMDUEL`,sub:[{id:`supply`,title:`Supply`},{id:`burn`,title:`Burn`}]},{id:`gas`,title:`Gas`,sub:[]}]},{group:`Using the site`,sections:[{id:`trading`,title:`Trading`,sub:[]},{id:`liquidity`,title:`Liquidity`,sub:[]},{id:`your-profile`,title:`Your profile`,sub:[]},{id:`create-a-duel`,title:`Create a duel`,sub:[]},{id:`withdraw`,title:`Withdraw`,sub:[]}]},{group:`Build`,sections:[{id:`contracts`,title:`Contracts`,sub:[]},{id:`read-a-duel`,title:`Read a duel`,sub:[]},{id:`trade-from-code`,title:`Trade from code`,sub:[]}]},{group:`Trust`,sections:[{id:`security`,title:`Security`,sub:[]},{id:`known-limits`,title:`Known limits`,sub:[]},{id:`glossary`,title:`Glossary`,sub:[]}]}]},h=(e,t)=>{let a=t.params.section;n(e,i`<div class="overview wrap">${s(`Docs`,{href:`#/`,label:`Home`},{lede:`How IMDuel works: the game, the money, the site and the contracts.`,end:r({label:`Find a duel`,href:`#/duels`,tone:`ink`,size:`sm`}),className:`overview-title`})}
    ${l(m,a)}</div>`);let o=e.querySelector(`[data-walkthrough]`);o&&n(o,f());let c=o?p(o.querySelector(`.walkthrough`)):void 0,d=u(e,m,a);return()=>{d(),c?.()}};export{h as default};