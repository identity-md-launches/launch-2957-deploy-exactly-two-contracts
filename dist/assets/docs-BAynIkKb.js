import{a as e,c as t,l as n,n as r,s as i}from"./controls-BHCuqmWb.js";import{F as a,Y as o}from"./discovery-MWoTMWRX.js";/* empty css                 */import{t as s}from"./page-title-B-6VmzfP.js";import{t as c}from"./chessboard-CnHXIUPi.js";function l(n,a){let o=i`${n.toc.map(t=>i`<p class="label docs-group">${t.group}</p><ul>${t.sections.map(t=>i`<li><a class="${e(`docs-link`,{"is-on":t.id===a})}" href="#/docs/${t.id}" data-docs-link="${t.id}">${t.title}</a></li>`)}</ul>`)}`;return i`<div class="docs">
    <nav class="docs-nav" aria-label="Contents"><details class="docs-contents" open data-docs-contents><summary class="label">Contents</summary>${o}</details></nav>
    <article class="docs-body">
      <div class="docs-tools">${r({label:`Copy page as Markdown`,size:`sm`,data:{"docs-copy":``}})}<a class="text-link" href="docs/llms.txt" target="_blank" rel="noopener">llms.txt</a></div>
      <div class="prose">${t(n.html)}</div>
    </article>
  </div>`}function u(e,t,n){let i=(e,t)=>navigator.clipboard?.writeText(e).then(()=>{let e=t.querySelector(`.key-label`)??t,n=e.textContent;e.textContent=`Copied`,setTimeout(()=>{e.textContent=n},1200)},()=>void 0);for(let t of e.querySelectorAll(`.docs-code`))t.insertAdjacentHTML(`beforeend`,r({label:`Copy`,size:`sm`,data:{"code-copy":``}}).value);let a=e.querySelector(`[data-docs-contents]`),o=matchMedia(`(max-width: 900px)`);a&&o.matches&&(a.open=!1);let s=t=>e.querySelectorAll(`[data-docs-link]`).forEach(e=>e.classList.toggle(`is-on`,e.dataset.docsLink===t)),c=(t,n)=>{let r=e.querySelector(`#${CSS.escape(t)}`);r&&(r.scrollIntoView({behavior:n&&!matchMedia(`(prefers-reduced-motion: reduce)`).matches?`smooth`:`auto`}),s(t))},l=e=>{let n=e.target,r=n.closest(`[data-code-copy]`);if(r)return void i(r.closest(`.docs-code`)?.querySelector(`code`)?.textContent??``,r);let s=n.closest(`[data-docs-copy]`);if(s)return void i(t.markdown,s);let l=n.closest(`a[href^="#/docs/"]`);if(!l||e.metaKey||e.ctrlKey||e.shiftKey)return;e.preventDefault();let u=l.getAttribute(`href`).slice(7);history.pushState(null,``,`#/docs/${u}`),a&&o.matches&&(a.open=!1),c(u,!0)};e.addEventListener(`click`,l);let u=[...e.querySelectorAll(`.prose h2[id]`)],d=new IntersectionObserver(e=>{let t=e.filter(e=>e.isIntersecting).sort((e,t)=>e.boundingClientRect.top-t.boundingClientRect.top)[0];t&&s(t.target.id)},{rootMargin:`0px 0px -70% 0px`});return u.forEach(e=>d.observe(e)),n&&requestAnimationFrame(()=>c(n,!1)),()=>{e.removeEventListener(`click`,l),d.disconnect()}}var d=[[`Trade`,`Buy the token of the team you back.`,`A normal buy in the duel’s pool is a bid for its team’s next move. It funds the reward pools and sets a strength from what it receives as a share of its team’s reward pool.`],[`Bid`,`The biggest bid owns the move.`,`A new top bid must pay more than 10% over the current one. Bidding stays open for about 36 seconds after the previous move is played; then the move is fixed.`],[`Move`,`A later trade plays the engine’s move.`,`The hash of the window’s last block supplies the seed, so nobody knows the move while bidding. The next trade, from either team, advances the board. You don’t choose a square.`],[`Prize`,`Checkmate wins the jackpot.`,`Here Nxe5 takes a pawn and the game goes on. The move that mates wins the jackpot from the losing team’s reward pool, paid in its token; every trade in the game grows it.`]],f=()=>i`<div class="walkthrough"><div class="walk-board"></div><div class="walk-body"><span class="label">Example turn / Nxe5</span>
  <div class="walk-steps" role="group" aria-label="Steps in a turn">${d.map(([e],t)=>r({label:`${t+1}. ${e}`,size:`sm`,pressed:t===0,data:{lesson:t}}))}</div>
  <div class="walk-explanation" aria-live="polite"><h3></h3><p></p></div><p class="walk-disclaimer">Illustrated sequence. The live engine chooses its own move.</p></div></div>`;function p(e){let t=new c(e.querySelector(`.walk-board`),`Example turn`),n=0,r=r=>{n=Math.max(0,Math.min(3,r));let i=new o;for(let e of`e4 e5 Nf3 Nc6 Bc4 Nd4`.split(` `))i.move(e);let s=n>=2?i.move(`Nxe5`):void 0,c=e=>`abcdefgh`.indexOf(e[0])+(Number(e[1])-1)*8;t.show({pieces:a(i.fen()),last:s?{from:c(s.from),to:c(s.to)}:void 0}),e.querySelectorAll(`[data-lesson]`).forEach(e=>e.setAttribute(`aria-pressed`,String(Number(e.dataset.lesson)===n))),e.querySelector(`h3`).textContent=d[n][1],e.querySelector(`.walk-explanation p`).textContent=d[n][2]},i=new AbortController;return e.addEventListener(`click`,e=>{let t=e.target.closest(`[data-lesson]`);t&&r(Number(t.dataset.lesson))},{signal:i.signal}),r(0),()=>i.abort()}var m={html:`<h2 id="what-imduel-is"><a class="docs-anchor" href="#/docs/what-imduel-is" aria-label="Link to this section">#</a>What IMDuel is</h2>
<p>IMDuel is chess played by trades. Each duel is a Uniswap v4 pool of two tokens, and the two tokens are the teams. Buying a token bids for its team&#39;s next move, and an onchain engine plays it. Checkmate wins the jackpot.</p>
<ul>
<li>The main duel is <strong>IMDUEL / IMD</strong>. Anyone can create a duel of any token against IMD or IMDUEL.</li>
<li>Every swap in a duel pays a 0.75% fee: 0.65% fills the two teams&#39; reward pools and 0.1% is burned as IMDUEL.</li>
<li>The move that mates wins from the losing team&#39;s reward pool, paid in that team&#39;s token.</li>
<li>There is no owner, admin key, pause or upgrade. The rules are the contracts.</li>
</ul>
<p>A bigger buy plays a stronger move, but it can&#39;t guarantee a mate, a win or a profit, and token prices move. Trade only what you can afford to lose.</p>
<h2 id="quick-start"><a class="docs-anchor" href="#/docs/quick-start" aria-label="Link to this section">#</a>Quick start</h2>
<ol>
<li><strong>Connect.</strong> Press Connect in the header. You need ETH for gas and a token to pay with: in IMDUEL / IMD, you pay IMD to buy IMDUEL and IMDUEL to buy IMD.</li>
<li><strong>Pick a duel.</strong> Open <a href="#/duels">Duels</a> and choose one. Its page shows the live game, whose move it is and what a checkmate wins now.</li>
<li><strong>Buy for a team.</strong> In the Trade panel, choose the team you back and an amount. The panel shows whether your buy takes the top bid and how strong the move would be.</li>
<li><strong>Watch the move.</strong> When bidding closes, the move is fixed and the next trade in the pool plays it.</li>
<li><strong>See your activity.</strong> Press your address in the header for your moves, your profile and anything you&#39;ve won.</li>
</ol>
<h2 id="how-a-move-works"><a class="docs-anchor" href="#/docs/how-a-move-works" aria-label="Link to this section">#</a>How a move works</h2>
<div data-walkthrough></div><h3 id="every-buy-bids"><a class="docs-anchor" href="#/docs/every-buy-bids" aria-label="Link to this section">#</a>Every buy bids</h3>
<p>Buying a team&#39;s token bids for that team&#39;s next open move: the move being decided if it&#39;s that team&#39;s turn, otherwise its following move. There is no minimum, and any app or aggregator can send the trade. If the game ends before your move comes up, your bid carries over to your team&#39;s first move of the next game.</p>
<p>The biggest bid owns the move. To take the top spot, a buy must pay more than 10% above the current top bid; smaller buys just trade. The Trade panel shows the amount to beat.</p>
<h3 id="bidding"><a class="docs-anchor" href="#/docs/bidding" aria-label="Link to this section">#</a>Bidding</h3>
<p>Bidding on a move stays open for 3 blocks after the previous move is played, about 36 seconds on Ethereum. If nobody bids in that time, the next bid opens a fresh 3-block window, and so does a move&#39;s first bid if it lands in a window&#39;s last block, so the other bidders can always answer it.</p>
<h3 id="the-seed"><a class="docs-anchor" href="#/docs/the-seed" aria-label="Link to this section">#</a>The seed</h3>
<p>When bidding closes, the hash of the window&#39;s last block seeds the engine. That hash doesn&#39;t exist while anyone can still bid, so nobody can know in advance which move a bid will play. Once the block is mined the move is fixed, and the site shows it before it&#39;s played.</p>
<h3 id="playing-the-move"><a class="docs-anchor" href="#/docs/playing-the-move" aria-label="Link to this section">#</a>Playing the move</h3>
<p>The first trade after bidding closes plays the move. It can come from either team and be any size; it doesn&#39;t change the move. That trade also pays the engine&#39;s gas (see <a href="#/docs/gas">Gas</a>).</p>
<h3 id="timeouts"><a class="docs-anchor" href="#/docs/timeouts" aria-label="Link to this section">#</a>Timeouts</h3>
<p>If the side to move gets no bid for 10 minutes, the next trade by the other team plays that move at 0% strength, owned by nobody. A real bid in the same block takes it over. A move owned by nobody wins nothing, even if it mates.</p>
<p>If a move waits so long that the chain no longer serves its block hash (8,191 blocks, about a day), it is played at its bid&#39;s strength and owned by nobody, so stalling never helps the bidder.</p>
<h2 id="strength"><a class="docs-anchor" href="#/docs/strength" aria-label="Link to this section">#</a>Strength</h2>
<p>A move&#39;s strength comes from what its buy received, as a share of its own team&#39;s reward pool. It reads no prices and no liquidity, so the only way to change it is to put money into the reward pool, and that money goes to the winners. An empty reward pool plays at the cap, so right after launch and after each mate most moves play strong until the pool grows.</p>
<table>
<thead>
<tr>
<th>Buy as a share of the team&#39;s reward pool</th>
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
<p>Strength sets how hard the engine looks. At 0% it plays like a beginner who still notices captures and checks; near the cap, like a strong amateur. Every strength keeps a few seeded mistakes, more at low strength, so games stay human: even a whale&#39;s move can miss a mate.</p>
<h3 id="the-engine"><a class="docs-anchor" href="#/docs/the-engine" aria-label="Link to this section">#</a>The engine</h3>
<p>The engine runs onchain, inside the trade that plays the move. It scores every legal move for material, position, pressure on the enemy king and the risk it leaves, and it always weighs captures and checks. Higher strength gives the leading moves more second looks. Against a lone king it plays at full effort to finish the game, and the longer a game goes without a capture or pawn move, the harder it pushes for progress.</p>
<h2 id="the-prize"><a class="docs-anchor" href="#/docs/the-prize" aria-label="Link to this section">#</a>The prize</h2>
<p>Checkmate wins the jackpot. The owner of the move that mates wins from the losing team&#39;s reward pool, in the losing team&#39;s token: buy IMDUEL and mate, and you win IMD; buy IMD and mate, and you win IMDUEL. The winning team&#39;s own reward pool is untouched.</p>
<p>The prize is the smallest of three amounts:</p>
<ul>
<li>a quarter of the losing team&#39;s reward pool;</li>
<li>2x what the mating bid paid;</li>
<li>what this game&#39;s trades paid into the losing team&#39;s reward pool.</li>
</ul>
<p>Every trade pays into both reward pools, so the prize grows with every trade in the game, and a bigger bid can win more. What isn&#39;t paid out stays in the reward pool for the next mate. Draws and timeouts leave the pools to keep growing.</p>
<p><strong>Who is paid.</strong> Only the owner of the mating move: the top bid when its bidding closed. The owner is the address your trade names; trading on this site always names you, and a trade from another app names the wallet that signed it (see <a href="#/docs/trade-from-code">Trade from code</a>).</p>
<p><strong>Claiming.</strong> The prize is recorded for the owner when the mate is played. Withdraw it from Payouts under the duel&#39;s board, whenever you like (see <a href="#/docs/withdraw">Withdraw</a>).</p>
<p>A mate in one is visible to everyone, so expect a race for it: bots may bid in the window&#39;s last block. Their bids are buys like any other.</p>
<h2 id="games-and-draws"><a class="docs-anchor" href="#/docs/games-and-draws" aria-label="Link to this section">#</a>Games and draws</h2>
<p>A game ends by checkmate or a draw. The board then resets, the teams swap colours and the next trade starts a new game. The reward pools carry over.</p>
<p>Draws are automatic:</p>
<ul>
<li>stalemate;</li>
<li>too few pieces to mate (two kings, or a king and one knight or bishop against a king);</li>
<li>the same position for the third time, counting the last sixteen half-moves (the start position counts from any distance);</li>
<li>60 half-moves without a capture or pawn move;</li>
<li>200 half-moves in total;</li>
<li>the engine failing to answer twice on one position (it never has).</li>
</ul>
<p>In each duel&#39;s first game, White is the team of the token people buy, not the base token: in the main duel, IMDUEL. Colours alternate after that.</p>
<h2 id="fees"><a class="docs-anchor" href="#/docs/fees" aria-label="Link to this section">#</a>Fees</h2>
<p>Every swap in a duel pays two fees:</p>
<ul>
<li><strong>The duel fee, 0.75%.</strong> 0.65% fills the reward pools and 0.1% is the slice, which burns IMDUEL (see <a href="#/docs/imduel">IMDUEL</a>).</li>
<li><strong>The pool fee.</strong> It goes to the pool&#39;s liquidity providers. In the main duel it is 1.25%: 1% to the launch wallet and 0.25% to the IMD network. Other duels use the fee their creator chose.</li>
</ul>
<p>A trade in the main duel costs 2% in fees, plus gas and price impact. Every swap that pays the duel fee emits Uniswap&#39;s standard <code>HookSwap</code> event, so explorers count the full cost.</p>
<h2 id="reward-pools"><a class="docs-anchor" href="#/docs/reward-pools" aria-label="Link to this section">#</a>Reward pools</h2>
<p>Each duel has two reward pools, one per team, each in its team&#39;s token.</p>
<ul>
<li>The 0.65% is taken half from each side of a trade, half from what it pays and half from what it buys, and each half goes into the reward pool of its own token. Every trade feeds both pools by about the same value.</li>
<li>Anyone can add to a reward pool with the hook&#39;s <code>fundChest</code>. That raises what a mate against that team wins and, because strength is a share of the reward pool, makes that team&#39;s bids weaker.</li>
<li>Only a checkmate&#39;s prize ever leaves a reward pool.</li>
</ul>
<h2 id="imduel"><a class="docs-anchor" href="#/docs/imduel" aria-label="Link to this section">#</a>IMDUEL</h2>
<p>IMDUEL is the main duel&#39;s token, launched by the IMD swarm together with the hook and paired with IMD.</p>
<h3 id="supply"><a class="docs-anchor" href="#/docs/supply" aria-label="Link to this section">#</a>Supply</h3>
<p>1,000,000,000 IMDUEL, fixed. At launch:</p>
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
<td>Wallets that worked on the launch (the swarm&#39;s airdrop)</td>
</tr>
<tr>
<td>10%</td>
<td>The launch wallet <code>0x6AA3…5B23</code>, for the team and for seeding new features and chain expansions</td>
</tr>
</tbody></table>
<h3 id="burn"><a class="docs-anchor" href="#/docs/burn" aria-label="Link to this section">#</a>Burn</h3>
<p>The 0.1% slice is taken in IMDUEL wherever a duel holds IMDUEL (the main duel always does) and burned. A duel without IMDUEL, paired with IMD, takes its slice in IMD and adds it to the main duel&#39;s IMD reward pool instead. The burn is owed to <code>0x…dEaD</code>; anyone can send it there with the hook&#39;s <code>withdraw(0x…dEaD, IMDUEL)</code>.</p>
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
<td>about 530,000; usually 350,000 to 650,000</td>
</tr>
</tbody></table>
<p>The trade that plays a move runs the engine, so it costs more, whoever sends it. This site sends every trade with a gas limit of 5,000,000, and you pay only for the gas used. If another app sends a trade with too low a limit and bidding closes before it lands, the trade reverts with <code>NotEnoughGas</code> instead of playing a weaker move: only the gas is spent, and you can send it again with a higher limit.</p>
<h2 id="trading"><a class="docs-anchor" href="#/docs/trading" aria-label="Link to this section">#</a>Trading</h2>
<p>The site trades through Uniswap&#39;s own contracts, the Universal Router and Permit2.</p>
<ol>
<li><strong>Approve, once per token.</strong> A transaction that lets Permit2 move that token.</li>
<li><strong>Sign a permit.</strong> No gas. It allows the router this amount for a short time; skipped while an earlier permit still covers the trade.</li>
<li><strong>Send the trade.</strong> One transaction, with the permit inside it.</li>
</ol>
<p><strong>Slippage.</strong> Auto allows 0.5% plus the largest recent price move within a block in this pool, at most 5%. Other bids for the same move buy the same token, so trades ahead of yours in a block move your price. Whatever you allow is also what a bot trading around yours could take.</p>
<h2 id="liquidity"><a class="docs-anchor" href="#/docs/liquidity" aria-label="Link to this section">#</a>Liquidity</h2>
<p>The Pool switch on a duel&#39;s panel adds liquidity to its Uniswap pool. Liquidity earns the pool fee, shared by size; the 0.75% duel fee is separate. Your position is a Uniswap position NFT in your wallet, and it has no effect on anyone&#39;s strength or prize.</p>
<h2 id="your-profile"><a class="docs-anchor" href="#/docs/your-profile" aria-label="Link to this section">#</a>Your profile</h2>
<p>Every address has a profile at <code>#/profile/0x…</code>: press an address anywhere on the site to open it, or rest on it to see a card. It shows what the hook counts for that address in the main duel (games, checkmates, moves by piece, pieces taken, checks, castles, promotions, moves at full strength and amounts won) and the badges those counts earn. Names and avatars come from ENS.</p>
<p>The <a href="#/leaderboard">Leaderboard</a> ranks every player of the main duel by badges, checkmates, moves, pieces taken or games. Badges are computed from the hook&#39;s counts, not minted. Other duels don&#39;t count.</p>
<h2 id="create-a-duel"><a class="docs-anchor" href="#/docs/create-a-duel" aria-label="Link to this section">#</a>Create a duel</h2>
<p><a href="#/create">Create a duel</a> for any ERC-20, or ETH, against IMD or IMDUEL. It&#39;s free apart from gas and your starting liquidity, which stays yours.</p>
<ul>
<li>Pick the token, the pair and the pool fee.</li>
<li>Set the starting deposits: they set the opening price.</li>
<li>If that exact pool already exists, the site opens it instead.</li>
</ul>
<p>A new duel charges the same duel fee from its first trade. It must be paired with IMD or IMDUEL so its slice has somewhere to go; the hook refuses any other pair.</p>
<h2 id="withdraw"><a class="docs-anchor" href="#/docs/withdraw" aria-label="Link to this section">#</a>Withdraw</h2>
<p>Prizes are recorded for their owners and never sent inside a trade. Payouts, under each duel&#39;s board, shows what is yours with a Withdraw button. Anyone can call <code>withdraw</code>, but it only ever pays the owner; <code>withdrawTo</code> lets the owner send to another address. Prizes wait as long as you like. A withdrawal leaves 1 wei behind, which makes your next prize cheaper to record; the site counts it as nothing.</p>
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
<td>Audits</td>
<td><a href="https://explorer.imd.fun/jobs/74895075-9f30-49e2-8c89-ec79383f8102">74895075</a> (this code: 1 low fixed, 1 info documented) and <a href="https://explorer.imd.fun/jobs/6acefe89-1311-462a-8f78-5697050c327d">6acefe89</a> (an earlier version: every finding fixed)</td>
</tr>
<tr>
<td>Launch wallet</td>
<td><code>0x6AA302EFf055259c9Cf177f33Ae3cBA5d4135B23</code> (the 10% supply and the 1% pool fee)</td>
</tr>
</tbody></table>
<p>The deployed source is in <a href="https://github.com/identity-md-launches/launch-2843-launch-imduel-imduel-launch-json">the swarm&#39;s launch repository</a>. The hook has no admin functions; the engine holds no state and no funds.</p>
<p>IMD launch 2666 (token <code>0xbe481aE624F87f0e991d4481CF6B3ABD3278d29e</code>) was a rehearsal of an earlier version. That token is not IMDUEL.</p>
<h2 id="read-a-duel"><a class="docs-anchor" href="#/docs/read-a-duel" aria-label="Link to this section">#</a>Read a duel</h2>
<p>A duel is identified by its Uniswap pool id.</p>
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
<td><code>gameInflow(poolId, gameNo)</code></td>
<td>what a game&#39;s trades paid into each reward pool</td>
</tr>
<tr>
<td><code>owed(owner, currencyId)</code></td>
<td>prizes waiting to be withdrawn</td>
</tr>
<tr>
<td><code>MATE_SHARE_BPS</code>, <code>PAYOUT_CAP</code>, <code>MATE_INFLOW_CAP</code></td>
<td>the prize&#39;s limits: 2,500 (a quarter of the reward pool), 2 (twice the bid) and 1 (the game&#39;s pay-in)</td>
</tr>
<tr>
<td><code>stats(address)</code></td>
<td>a player&#39;s counts in the main duel, in two packed words</td>
</tr>
<tr>
<td><code>players(i)</code>, <code>playerCount()</code></td>
<td>every address that has owned a played move in the main duel</td>
</tr>
</tbody></table>
<p>Events: <code>GameStarted</code>, <code>Bid</code>, <code>Moved</code>, <code>MatePaid</code>, <code>GameOver</code>, <code>DrawTriggered</code>, <code>EngineFailed</code>, <code>Withdrawn</code>, <code>ChestFunded</code>, <code>MainDuel</code>, <code>HookSwap</code>.</p>
<h2 id="trade-from-code"><a class="docs-anchor" href="#/docs/trade-from-code" aria-label="Link to this section">#</a>Trade from code</h2>
<p>Any router or aggregator can trade a duel, and every buy bids. The owner of a bid is the address in <code>hookData</code>, 20 bytes packed or 32 bytes ABI-encoded; without it, the owner is the wallet that signed the transaction. Pass it for a smart-contract wallet or a relayed trade, where the signer isn&#39;t the trader.</p>
<pre class="docs-code"><code>hookData = abi.encodePacked(owner)   // 20 bytes
hookData = abi.encode(owner)         // 32 bytes</code></pre>
<p>Send every trade with a gas limit of at least 5,000,000. A trade that plays a move must have the engine&#39;s full 3,000,000 on hand when it calls it, or it reverts with <code>NotEnoughGas</code>; unused gas isn&#39;t charged. Bidding can close between your gas estimate and your block, and then your trade is the one that plays the move.</p>
<h2 id="security"><a class="docs-anchor" href="#/docs/security" aria-label="Link to this section">#</a>Security</h2>
<ul>
<li>No owner, admin, pause or upgrade. The hook and the engine are immutable.</li>
<li>Invariant tests and symbolic proofs check the books in every currency: what the hook holds equals the reward pools plus the burn plus what is owed, and every mate pays exactly the smallest of its three limits.</li>
<li>Audited twice by the IMD swarm (see <a href="#/docs/contracts">Contracts</a>), plus our own reviews, fuzzing with Foundry and Echidna, and a launch rehearsed on a copy of Ethereum.</li>
<li>An engine failure never breaks a trade: a seeded legal move is played at 0% instead, and if that fails too, the game ends in a draw.</li>
<li>A hostile token can only affect its own duel.</li>
</ul>
<h2 id="known-limits"><a class="docs-anchor" href="#/docs/known-limits" aria-label="Link to this section">#</a>Known limits</h2>
<ul>
<li><strong>Block builders.</strong> Whoever builds a window&#39;s last block can bid in it and try different versions of the block, keeping one whose hash plays a winning move. It&#39;s only worth it for a large prize, and a mate pays at most 2x what the bid paid.</li>
<li><strong>Reorganisations.</strong> A move is fixed once its window&#39;s last block is in. If the chain replaced that block (rare on Ethereum), the move would change with it.</li>
<li><strong>The last block.</strong> A raise in a window&#39;s last block can&#39;t be answered. Bots that see a mate in one will bid late for it.</li>
<li><strong>Small reward pools.</strong> While a reward pool is small, every bid plays near the cap, and a large donation to a pool makes that team&#39;s bids weaker.</li>
<li><strong>Throwing games.</strong> A team can lose on purpose, but every move costs fees and the prize comes out of its own reward pool, so it loses money doing it.</li>
<li><strong>Relayed trades.</strong> A trade relayed for a smart-contract wallet without the owner in <code>hookData</code> credits the wallet that signed it, not the trader.</li>
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
<td>The address the top bid named; it wins the prize if its move mates</td>
</tr>
<tr>
<td>Window</td>
<td>The blocks during which a move takes bids</td>
</tr>
<tr>
<td>Strength</td>
<td>How hard the engine looks, from the bid&#39;s share of its team&#39;s reward pool</td>
</tr>
<tr>
<td>Reward pool</td>
<td>A team&#39;s prize money, in its token; a checkmate against the team wins from it</td>
</tr>
<tr>
<td>Timeout move</td>
<td>A 0% move owned by nobody, after 10 minutes without a bid</td>
</tr>
<tr>
<td>Slice</td>
<td>The 0.1% of every swap: burned as IMDUEL, or in a duel without IMDUEL, added in IMD to the main duel&#39;s IMD reward pool</td>
</tr>
</tbody></table>
`,markdown:`# IMDuel docs

<!-- group: Start -->

## What IMDuel is

IMDuel is chess played by trades. Each duel is a Uniswap v4 pool of two tokens, and the two tokens are the teams. Buying a token bids for its team's next move, and an onchain engine plays it. Checkmate wins the jackpot.

- The main duel is **IMDUEL / IMD**. Anyone can create a duel of any token against IMD or IMDUEL.
- Every swap in a duel pays a 0.75% fee: 0.65% fills the two teams' reward pools and 0.1% is burned as IMDUEL.
- The move that mates wins from the losing team's reward pool, paid in that team's token.
- There is no owner, admin key, pause or upgrade. The rules are the contracts.

A bigger buy plays a stronger move, but it can't guarantee a mate, a win or a profit, and token prices move. Trade only what you can afford to lose.

## Quick start

1. **Connect.** Press Connect in the header. You need ETH for gas and a token to pay with: in IMDUEL / IMD, you pay IMD to buy IMDUEL and IMDUEL to buy IMD.
2. **Pick a duel.** Open [Duels](#/duels) and choose one. Its page shows the live game, whose move it is and what a checkmate wins now.
3. **Buy for a team.** In the Trade panel, choose the team you back and an amount. The panel shows whether your buy takes the top bid and how strong the move would be.
4. **Watch the move.** When bidding closes, the move is fixed and the next trade in the pool plays it.
5. **See your activity.** Press your address in the header for your moves, your profile and anything you've won.

<!-- group: Play -->

## How a move works

<div data-walkthrough></div>

### Every buy bids

Buying a team's token bids for that team's next open move: the move being decided if it's that team's turn, otherwise its following move. There is no minimum, and any app or aggregator can send the trade. If the game ends before your move comes up, your bid carries over to your team's first move of the next game.

The biggest bid owns the move. To take the top spot, a buy must pay more than 10% above the current top bid; smaller buys just trade. The Trade panel shows the amount to beat.

### Bidding

Bidding on a move stays open for 3 blocks after the previous move is played, about 36 seconds on Ethereum. If nobody bids in that time, the next bid opens a fresh 3-block window, and so does a move's first bid if it lands in a window's last block, so the other bidders can always answer it.

### The seed

When bidding closes, the hash of the window's last block seeds the engine. That hash doesn't exist while anyone can still bid, so nobody can know in advance which move a bid will play. Once the block is mined the move is fixed, and the site shows it before it's played.

### Playing the move

The first trade after bidding closes plays the move. It can come from either team and be any size; it doesn't change the move. That trade also pays the engine's gas (see [Gas](#/docs/gas)).

### Timeouts

If the side to move gets no bid for 10 minutes, the next trade by the other team plays that move at 0% strength, owned by nobody. A real bid in the same block takes it over. A move owned by nobody wins nothing, even if it mates.

If a move waits so long that the chain no longer serves its block hash (8,191 blocks, about a day), it is played at its bid's strength and owned by nobody, so stalling never helps the bidder.

## Strength

A move's strength comes from what its buy received, as a share of its own team's reward pool. It reads no prices and no liquidity, so the only way to change it is to put money into the reward pool, and that money goes to the winners. An empty reward pool plays at the cap, so right after launch and after each mate most moves play strong until the pool grows.

| Buy as a share of the team's reward pool | Strength |
| --- | --- |
| 0.1% or less | 0% |
| 1% | 30% |
| 10% | 60% |
| The whole reward pool or more | 90% (the cap) |

Strength sets how hard the engine looks. At 0% it plays like a beginner who still notices captures and checks; near the cap, like a strong amateur. Every strength keeps a few seeded mistakes, more at low strength, so games stay human: even a whale's move can miss a mate.

### The engine

The engine runs onchain, inside the trade that plays the move. It scores every legal move for material, position, pressure on the enemy king and the risk it leaves, and it always weighs captures and checks. Higher strength gives the leading moves more second looks. Against a lone king it plays at full effort to finish the game, and the longer a game goes without a capture or pawn move, the harder it pushes for progress.

## The prize

Checkmate wins the jackpot. The owner of the move that mates wins from the losing team's reward pool, in the losing team's token: buy IMDUEL and mate, and you win IMD; buy IMD and mate, and you win IMDUEL. The winning team's own reward pool is untouched.

The prize is the smallest of three amounts:

- a quarter of the losing team's reward pool;
- 2x what the mating bid paid;
- what this game's trades paid into the losing team's reward pool.

Every trade pays into both reward pools, so the prize grows with every trade in the game, and a bigger bid can win more. What isn't paid out stays in the reward pool for the next mate. Draws and timeouts leave the pools to keep growing.

**Who is paid.** Only the owner of the mating move: the top bid when its bidding closed. The owner is the address your trade names; trading on this site always names you, and a trade from another app names the wallet that signed it (see [Trade from code](#/docs/trade-from-code)).

**Claiming.** The prize is recorded for the owner when the mate is played. Withdraw it from Payouts under the duel's board, whenever you like (see [Withdraw](#/docs/withdraw)).

A mate in one is visible to everyone, so expect a race for it: bots may bid in the window's last block. Their bids are buys like any other.

## Games and draws

A game ends by checkmate or a draw. The board then resets, the teams swap colours and the next trade starts a new game. The reward pools carry over.

Draws are automatic:

- stalemate;
- too few pieces to mate (two kings, or a king and one knight or bishop against a king);
- the same position for the third time, counting the last sixteen half-moves (the start position counts from any distance);
- 60 half-moves without a capture or pawn move;
- 200 half-moves in total;
- the engine failing to answer twice on one position (it never has).

In each duel's first game, White is the team of the token people buy, not the base token: in the main duel, IMDUEL. Colours alternate after that.

<!-- group: Money -->

## Fees

Every swap in a duel pays two fees:

- **The duel fee, 0.75%.** 0.65% fills the reward pools and 0.1% is the slice, which burns IMDUEL (see [IMDUEL](#/docs/imduel)).
- **The pool fee.** It goes to the pool's liquidity providers. In the main duel it is 1.25%: 1% to the launch wallet and 0.25% to the IMD network. Other duels use the fee their creator chose.

A trade in the main duel costs 2% in fees, plus gas and price impact. Every swap that pays the duel fee emits Uniswap's standard \`HookSwap\` event, so explorers count the full cost.

## Reward pools

Each duel has two reward pools, one per team, each in its team's token.

- The 0.65% is taken half from each side of a trade, half from what it pays and half from what it buys, and each half goes into the reward pool of its own token. Every trade feeds both pools by about the same value.
- Anyone can add to a reward pool with the hook's \`fundChest\`. That raises what a mate against that team wins and, because strength is a share of the reward pool, makes that team's bids weaker.
- Only a checkmate's prize ever leaves a reward pool.

## IMDUEL

IMDUEL is the main duel's token, launched by the IMD swarm together with the hook and paired with IMD.

### Supply

1,000,000,000 IMDUEL, fixed. At launch:

| Share | Goes to |
| --- | --- |
| 80% | The pool, single-sided: everyone buys from it |
| 8% | IMD seats connected at launch, shared equally (the swarm's airdrop) |
| 2% | Wallets that worked on the launch (the swarm's airdrop) |
| 10% | The launch wallet \`0x6AA3…5B23\`, for the team and for seeding new features and chain expansions |

### Burn

The 0.1% slice is taken in IMDUEL wherever a duel holds IMDUEL (the main duel always does) and burned. A duel without IMDUEL, paired with IMD, takes its slice in IMD and adds it to the main duel's IMD reward pool instead. The burn is owed to \`0x…dEaD\`; anyone can send it there with the hook's \`withdraw(0x…dEaD, IMDUEL)\`.

## Gas

| Trade | Typical gas |
| --- | --- |
| A plain trade | about 180,000 |
| A trade that plays a move | about 530,000; usually 350,000 to 650,000 |

The trade that plays a move runs the engine, so it costs more, whoever sends it. This site sends every trade with a gas limit of 5,000,000, and you pay only for the gas used. If another app sends a trade with too low a limit and bidding closes before it lands, the trade reverts with \`NotEnoughGas\` instead of playing a weaker move: only the gas is spent, and you can send it again with a higher limit.

<!-- group: Using the site -->

## Trading

The site trades through Uniswap's own contracts, the Universal Router and Permit2.

1. **Approve, once per token.** A transaction that lets Permit2 move that token.
2. **Sign a permit.** No gas. It allows the router this amount for a short time; skipped while an earlier permit still covers the trade.
3. **Send the trade.** One transaction, with the permit inside it.

**Slippage.** Auto allows 0.5% plus the largest recent price move within a block in this pool, at most 5%. Other bids for the same move buy the same token, so trades ahead of yours in a block move your price. Whatever you allow is also what a bot trading around yours could take.

## Liquidity

The Pool switch on a duel's panel adds liquidity to its Uniswap pool. Liquidity earns the pool fee, shared by size; the 0.75% duel fee is separate. Your position is a Uniswap position NFT in your wallet, and it has no effect on anyone's strength or prize.

## Your profile

Every address has a profile at \`#/profile/0x…\`: press an address anywhere on the site to open it, or rest on it to see a card. It shows what the hook counts for that address in the main duel (games, checkmates, moves by piece, pieces taken, checks, castles, promotions, moves at full strength and amounts won) and the badges those counts earn. Names and avatars come from ENS.

The [Leaderboard](#/leaderboard) ranks every player of the main duel by badges, checkmates, moves, pieces taken or games. Badges are computed from the hook's counts, not minted. Other duels don't count.

## Create a duel

[Create a duel](#/create) for any ERC-20, or ETH, against IMD or IMDUEL. It's free apart from gas and your starting liquidity, which stays yours.

- Pick the token, the pair and the pool fee.
- Set the starting deposits: they set the opening price.
- If that exact pool already exists, the site opens it instead.

A new duel charges the same duel fee from its first trade. It must be paired with IMD or IMDUEL so its slice has somewhere to go; the hook refuses any other pair.

## Withdraw

Prizes are recorded for their owners and never sent inside a trade. Payouts, under each duel's board, shows what is yours with a Withdraw button. Anyone can call \`withdraw\`, but it only ever pays the owner; \`withdrawTo\` lets the owner send to another address. Prizes wait as long as you like. A withdrawal leaves 1 wei behind, which makes your next prize cheaper to record; the site counts it as nothing.

<!-- group: Build -->

## Contracts

| Contract | Address |
| --- | --- |
| IMDuelHook | [\`0xA92F72DcDd90229C32F6d51229F4cc5c916410CC\`](https://etherscan.io/address/0xA92F72DcDd90229C32F6d51229F4cc5c916410CC) |
| ChessEngineV5 | [\`0xc21788F704a8b9456f7391A01d8a3D95Be215a27\`](https://etherscan.io/address/0xc21788F704a8b9456f7391A01d8a3D95Be215a27) |
| IMDUEL | [\`0xc012b8Db13C57beCd950eEfB70540e6f973A3C73\`](https://etherscan.io/address/0xc012b8Db13C57beCd950eEfB70540e6f973A3C73) |
| Main duel (pool id) | \`0xbb45eacf50b4bd8ce31e0620e14ff6e6b6375d56fce4372d3046f4a02faeae65\` |
| Launch | IMD launch 2843, [job 4098dafa](https://explorer.imd.fun/jobs/4098dafa-99b4-4c9f-97e3-430b49ea6afa), block 26,322,077 |
| Audits | [74895075](https://explorer.imd.fun/jobs/74895075-9f30-49e2-8c89-ec79383f8102) (this code: 1 low fixed, 1 info documented) and [6acefe89](https://explorer.imd.fun/jobs/6acefe89-1311-462a-8f78-5697050c327d) (an earlier version: every finding fixed) |
| Launch wallet | \`0x6AA302EFf055259c9Cf177f33Ae3cBA5d4135B23\` (the 10% supply and the 1% pool fee) |

The deployed source is in [the swarm's launch repository](https://github.com/identity-md-launches/launch-2843-launch-imduel-imduel-launch-json). The hook has no admin functions; the engine holds no state and no funds.

IMD launch 2666 (token \`0xbe481aE624F87f0e991d4481CF6B3ABD3278d29e\`) was a rehearsal of an earlier version. That token is not IMDUEL.

## Read a duel

A duel is identified by its Uniswap pool id.

| Read | Returns |
| --- | --- |
| \`game(poolId)\` | the board, the side to move, both top bids, the bidding window and the last move |
| \`chest(poolId, team)\` | a team's reward pool (team 0 is \`currency0\`'s) |
| \`previewMove(poolId, hash)\` | the move a closed window will play, given its last block's hash |
| \`gameInflow(poolId, gameNo)\` | what a game's trades paid into each reward pool |
| \`owed(owner, currencyId)\` | prizes waiting to be withdrawn |
| \`MATE_SHARE_BPS\`, \`PAYOUT_CAP\`, \`MATE_INFLOW_CAP\` | the prize's limits: 2,500 (a quarter of the reward pool), 2 (twice the bid) and 1 (the game's pay-in) |
| \`stats(address)\` | a player's counts in the main duel, in two packed words |
| \`players(i)\`, \`playerCount()\` | every address that has owned a played move in the main duel |

Events: \`GameStarted\`, \`Bid\`, \`Moved\`, \`MatePaid\`, \`GameOver\`, \`DrawTriggered\`, \`EngineFailed\`, \`Withdrawn\`, \`ChestFunded\`, \`MainDuel\`, \`HookSwap\`.

## Trade from code

Any router or aggregator can trade a duel, and every buy bids. The owner of a bid is the address in \`hookData\`, 20 bytes packed or 32 bytes ABI-encoded; without it, the owner is the wallet that signed the transaction. Pass it for a smart-contract wallet or a relayed trade, where the signer isn't the trader.

\`\`\`
hookData = abi.encodePacked(owner)   // 20 bytes
hookData = abi.encode(owner)         // 32 bytes
\`\`\`

Send every trade with a gas limit of at least 5,000,000. A trade that plays a move must have the engine's full 3,000,000 on hand when it calls it, or it reverts with \`NotEnoughGas\`; unused gas isn't charged. Bidding can close between your gas estimate and your block, and then your trade is the one that plays the move.

<!-- group: Trust -->

## Security

- No owner, admin, pause or upgrade. The hook and the engine are immutable.
- Invariant tests and symbolic proofs check the books in every currency: what the hook holds equals the reward pools plus the burn plus what is owed, and every mate pays exactly the smallest of its three limits.
- Audited twice by the IMD swarm (see [Contracts](#/docs/contracts)), plus our own reviews, fuzzing with Foundry and Echidna, and a launch rehearsed on a copy of Ethereum.
- An engine failure never breaks a trade: a seeded legal move is played at 0% instead, and if that fails too, the game ends in a draw.
- A hostile token can only affect its own duel.

## Known limits

- **Block builders.** Whoever builds a window's last block can bid in it and try different versions of the block, keeping one whose hash plays a winning move. It's only worth it for a large prize, and a mate pays at most 2x what the bid paid.
- **Reorganisations.** A move is fixed once its window's last block is in. If the chain replaced that block (rare on Ethereum), the move would change with it.
- **The last block.** A raise in a window's last block can't be answered. Bots that see a mate in one will bid late for it.
- **Small reward pools.** While a reward pool is small, every bid plays near the cap, and a large donation to a pool makes that team's bids weaker.
- **Throwing games.** A team can lose on purpose, but every move costs fees and the prize comes out of its own reward pool, so it loses money doing it.
- **Relayed trades.** A trade relayed for a smart-contract wallet without the owner in \`hookData\` credits the wallet that signed it, not the trader.

## Glossary

| Term | Meaning |
| --- | --- |
| Duel | A Uniswap v4 pool on the IMDuel hook; its two tokens are the teams |
| Top bid | The biggest buy for a team's next move; it owns the move |
| Owner | The address the top bid named; it wins the prize if its move mates |
| Window | The blocks during which a move takes bids |
| Strength | How hard the engine looks, from the bid's share of its team's reward pool |
| Reward pool | A team's prize money, in its token; a checkmate against the team wins from it |
| Timeout move | A 0% move owned by nobody, after 10 minutes without a bid |
| Slice | The 0.1% of every swap: burned as IMDUEL, or in a duel without IMDUEL, added in IMD to the main duel's IMD reward pool |
`,toc:[{group:`Start`,sections:[{id:`what-imduel-is`,title:`What IMDuel is`,sub:[]},{id:`quick-start`,title:`Quick start`,sub:[]}]},{group:`Play`,sections:[{id:`how-a-move-works`,title:`How a move works`,sub:[{id:`every-buy-bids`,title:`Every buy bids`},{id:`bidding`,title:`Bidding`},{id:`the-seed`,title:`The seed`},{id:`playing-the-move`,title:`Playing the move`},{id:`timeouts`,title:`Timeouts`}]},{id:`strength`,title:`Strength`,sub:[{id:`the-engine`,title:`The engine`}]},{id:`the-prize`,title:`The prize`,sub:[]},{id:`games-and-draws`,title:`Games and draws`,sub:[]}]},{group:`Money`,sections:[{id:`fees`,title:`Fees`,sub:[]},{id:`reward-pools`,title:`Reward pools`,sub:[]},{id:`imduel`,title:`IMDUEL`,sub:[{id:`supply`,title:`Supply`},{id:`burn`,title:`Burn`}]},{id:`gas`,title:`Gas`,sub:[]}]},{group:`Using the site`,sections:[{id:`trading`,title:`Trading`,sub:[]},{id:`liquidity`,title:`Liquidity`,sub:[]},{id:`your-profile`,title:`Your profile`,sub:[]},{id:`create-a-duel`,title:`Create a duel`,sub:[]},{id:`withdraw`,title:`Withdraw`,sub:[]}]},{group:`Build`,sections:[{id:`contracts`,title:`Contracts`,sub:[]},{id:`read-a-duel`,title:`Read a duel`,sub:[]},{id:`trade-from-code`,title:`Trade from code`,sub:[]}]},{group:`Trust`,sections:[{id:`security`,title:`Security`,sub:[]},{id:`known-limits`,title:`Known limits`,sub:[]},{id:`glossary`,title:`Glossary`,sub:[]}]}]},h=(e,t)=>{let a=t.params.section;n(e,i`<div class="overview wrap">${s(`Docs`,{href:`#/`,label:`Home`},{lede:`How IMDuel works: the game, the money, the site and the contracts.`,end:r({label:`Find a duel`,href:`#/duels`,tone:`ink`,size:`sm`}),className:`overview-title`})}
    ${l(m,a)}</div>`);let o=e.querySelector(`[data-walkthrough]`);o&&n(o,f());let c=o?p(o.querySelector(`.walkthrough`)):void 0,d=u(e,m,a);return()=>{d(),c?.()}};export{h as default};