import{a as e,c as t,l as n,n as r,s as i}from"./controls-BHCuqmWb.js";import{F as a,Y as o}from"./discovery-MWoTMWRX.js";/* empty css                 */import{t as s}from"./page-title-B-6VmzfP.js";import{t as c}from"./chessboard-WMAEQhKa.js";function l(n,a){let o=i`${n.toc.map(t=>i`<p class="label docs-group">${t.group}</p><ul>${t.sections.map(t=>i`<li><a class="${e(`docs-link`,{"is-on":t.id===a})}" href="#/docs/${t.id}" data-docs-link="${t.id}">${t.title}</a></li>`)}</ul>`)}`;return i`<div class="docs">
    <nav class="docs-nav" aria-label="Contents"><details class="docs-contents" open data-docs-contents><summary class="label">Contents</summary>${o}</details></nav>
    <article class="docs-body">
      <div class="docs-tools">${r({label:`Copy page as Markdown`,size:`sm`,data:{"docs-copy":``}})}<a class="text-link" href="docs/llms.txt" target="_blank" rel="noopener">llms.txt</a></div>
      <div class="prose">${t(n.html)}</div>
    </article>
  </div>`}function u(e,t,n){let i=(e,t)=>navigator.clipboard?.writeText(e).then(()=>{let e=t.querySelector(`.key-label`)??t,n=e.textContent;e.textContent=`Copied`,setTimeout(()=>{e.textContent=n},1200)},()=>void 0);for(let t of e.querySelectorAll(`.docs-code`))t.insertAdjacentHTML(`beforeend`,r({label:`Copy`,size:`sm`,data:{"code-copy":``}}).value);let a=e.querySelector(`[data-docs-contents]`),o=matchMedia(`(max-width: 900px)`);a&&o.matches&&(a.open=!1);let s=t=>e.querySelectorAll(`[data-docs-link]`).forEach(e=>e.classList.toggle(`is-on`,e.dataset.docsLink===t)),c=(t,n)=>{let r=e.querySelector(`#${CSS.escape(t)}`);r&&(r.scrollIntoView({behavior:n&&!matchMedia(`(prefers-reduced-motion: reduce)`).matches?`smooth`:`auto`}),s(t))},l=e=>{let n=e.target,r=n.closest(`[data-code-copy]`);if(r)return void i(r.closest(`.docs-code`)?.querySelector(`code`)?.textContent??``,r);let s=n.closest(`[data-docs-copy]`);if(s)return void i(t.markdown,s);let l=n.closest(`a[href^="#/docs/"]`);if(!l||e.metaKey||e.ctrlKey||e.shiftKey)return;e.preventDefault();let u=l.getAttribute(`href`).slice(7);history.pushState(null,``,`#/docs/${u}`),a&&o.matches&&(a.open=!1),c(u,!0)};e.addEventListener(`click`,l);let u=[...e.querySelectorAll(`.prose h2[id]`)],d=new IntersectionObserver(e=>{let t=e.filter(e=>e.isIntersecting).sort((e,t)=>e.boundingClientRect.top-t.boundingClientRect.top)[0];t&&s(t.target.id)},{rootMargin:`0px 0px -70% 0px`});return u.forEach(e=>d.observe(e)),n&&requestAnimationFrame(()=>c(n,!1)),()=>{e.removeEventListener(`click`,l),d.disconnect()}}var d=[[`Trade`,`Buy the token of the team you back.`,`A normal buy in the duel’s pool is a bid for its team’s next move. It funds the reward pools and sets a strength from what it receives as a share of its team’s reward pool.`],[`Bid`,`The biggest bid owns the move.`,`A new top bid must pay more than 10% over the current one. Bidding stays open for about 36 seconds after the previous move is played; then the move is fixed.`],[`Move`,`A later trade plays the engine’s move.`,`The hash of the window’s last block supplies the seed, so nobody knows the move while bidding. The next trade, from either team, advances the board. You don’t choose a square.`],[`Prize`,`Checkmate wins the jackpot.`,`Here Nxe5 takes a pawn and the game goes on. The move that mates wins the jackpot from the losing team’s reward pool, paid in its token; every trade in the game grows it.`]],f=()=>i`<div class="walkthrough"><div class="walk-board"></div><div class="walk-body"><span class="label">Example turn / Nxe5</span>
  <div class="walk-steps" role="group" aria-label="Steps in a turn">${d.map(([e],t)=>r({label:`${t+1}. ${e}`,size:`sm`,pressed:t===0,data:{lesson:t}}))}</div>
  <div class="walk-explanation" aria-live="polite"><h3></h3><p></p></div><p class="walk-disclaimer">Illustrated sequence. The live engine chooses its own move.</p></div></div>`;function p(e){let t=new c(e.querySelector(`.walk-board`),`Example turn`),n=0,r=r=>{n=Math.max(0,Math.min(3,r));let i=new o;for(let e of`e4 e5 Nf3 Nc6 Bc4 Nd4`.split(` `))i.move(e);let s=n>=2?i.move(`Nxe5`):void 0,c=e=>`abcdefgh`.indexOf(e[0])+(Number(e[1])-1)*8;t.show({pieces:a(i.fen()),last:s?{from:c(s.from),to:c(s.to)}:void 0}),e.querySelectorAll(`[data-lesson]`).forEach(e=>e.setAttribute(`aria-pressed`,String(Number(e.dataset.lesson)===n))),e.querySelector(`h3`).textContent=d[n][1],e.querySelector(`.walk-explanation p`).textContent=d[n][2]},i=new AbortController;return e.addEventListener(`click`,e=>{let t=e.target.closest(`[data-lesson]`);t&&r(Number(t.dataset.lesson))},{signal:i.signal}),r(0),()=>i.abort()}var m={html:`<h2 id="introduction"><a class="docs-anchor" href="#/docs/introduction" aria-label="Link to this section">#</a>Introduction</h2>
<p>IMDuel is a Uniswap v4 hook that plays chess. Every pool that uses it is a <strong>duel</strong>: its two tokens are two teams, and they play an endless series of chess games against each other.</p>
<ul>
<li><strong>Buying a token is a bid</strong> for its team&#39;s next move. The biggest buy owns the move.</li>
<li><strong>An onchain engine plays the move.</strong> Nobody picks the square; a bigger buy makes the engine play stronger.</li>
<li><strong>Checkmate wins the jackpot.</strong> The owner of the mating move wins from the losing team&#39;s reward pool.</li>
<li><strong>Every swap pays a 0.75% hook fee.</strong> 0.65% fills the reward pools and 0.1% burns $IMDUEL.</li>
</ul>
<p>A bid is an ordinary buy: you keep the tokens you bought, and the move comes with it. There is no ticket, no deposit and no separate call.</p>
<p>The main duel is <strong>$IMDUEL / $IMD</strong> on Ethereum. Anyone can create a duel of another token against $IMD or $IMDUEL. The contracts have no owner, no admin key, no pause and no upgrade.</p>
<p>IMDuel is experimental. A bigger buy plays a stronger move but guarantees no mate, win or profit, and token prices move. Trade only what you can afford to lose.</p>
<h2 id="quick-start"><a class="docs-anchor" href="#/docs/quick-start" aria-label="Link to this section">#</a>Quick start</h2>
<ol>
<li><strong>Get a token to pay with.</strong> In the main duel you buy $IMDUEL with $IMD, or $IMD with $IMDUEL. $IMD trades on Uniswap against ETH. You also need ETH for gas.</li>
<li><strong>Connect.</strong> Press Connect in the header and choose your wallet.</li>
<li><strong>Open a duel.</strong> <a href="#/duels">Duels</a> lists every duel; the main duel is first. Its page shows the board, whose move it is, the top bid and what a checkmate wins now.</li>
<li><strong>Buy for a team.</strong> In the Trade panel, pick the team you back and an amount. The panel shows whether your buy takes the top bid and how strong the move would be.</li>
<li><strong>Watch the move.</strong> About 36 seconds after the previous move, bidding closes and the move is fixed; the next trade in the pool plays it.</li>
</ol>
<h2 id="duels-and-teams"><a class="docs-anchor" href="#/docs/duels-and-teams" aria-label="Link to this section">#</a>Duels and teams</h2>
<p>A duel is a Uniswap v4 pool on the IMDuel hook. Each of its two tokens is a team: buy $IMDUEL to play for $IMDUEL, buy $IMD to play for $IMD. To buy one team&#39;s token you pay with the other&#39;s, so every trade plays for exactly one team.</p>
<p>Each team has a <strong>reward pool</strong> in its own token, filled by the hook fee on every trade (see <a href="#/docs/reward-pools">Reward pools</a>).</p>
<p>The teams swap colours every game. In a duel&#39;s first game White is the duel&#39;s own token and Black the token it is paired against: in the main duel, $IMDUEL plays White.</p>
<h2 id="bidding"><a class="docs-anchor" href="#/docs/bidding" aria-label="Link to this section">#</a>Bidding</h2>
<div data-walkthrough></div><p>Every buy of a team&#39;s token bids for that team&#39;s next move: the move being decided if it is that team&#39;s turn, otherwise its following move. There is no minimum, and it doesn&#39;t matter which app or aggregator sends the trade.</p>
<ul>
<li><strong>The top bid owns the move.</strong> Bids are compared by what the trade paid. To take the top spot, a buy must pay more than 10% over the current top bid; smaller buys just trade.</li>
<li><strong>The owner</strong> is the address the trade names. Trading on this site names you; a trade from another app names the wallet that signed it (see <a href="#/docs/trading-from-code">Trading from code</a>).</li>
<li><strong>Bidding lasts 3 blocks</strong> after the previous move is played, about 36 seconds on Ethereum. If a move&#39;s first bid comes in the last of those blocks or later, bidding stays open for 3 blocks from that bid, so the other bidders can always answer.</li>
<li><strong>Bids carry over.</strong> A bid for a move the game never reaches owns its team&#39;s first move of the next game.</li>
</ul>
<h2 id="moves"><a class="docs-anchor" href="#/docs/moves" aria-label="Link to this section">#</a>Moves</h2>
<p>When bidding closes, the hash of the window&#39;s last block seeds the engine. That hash doesn&#39;t exist while anyone can still bid, so no bidder can know which move their bid will play. Once that block is mined the move is fixed, and the site shows it before it is played.</p>
<p>The first trade after bidding closes plays the move. It can come from either team and be any size; it doesn&#39;t change the move, but it pays the engine&#39;s gas (see <a href="#/docs/gas">Gas</a>).</p>
<p><strong>Timeouts.</strong> If the side to move gets no bid for 10 minutes, a trade by the other team opens that move at 0% strength, owned by nobody. A real bid in the same block takes it over. A move owned by nobody wins nothing, even if it mates.</p>
<h2 id="strength"><a class="docs-anchor" href="#/docs/strength" aria-label="Link to this section">#</a>Strength</h2>
<p>Strength is how hard the engine thinks about a move. It comes from the tokens the owning buy received, compared with its own team&#39;s reward pool, which is in the same token:</p>
<table>
<thead>
<tr>
<th>Tokens received, as a share of the team&#39;s reward pool</th>
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
<p>Strength reads no price and no liquidity, so nothing outside the game can make a bid stronger or weaker. The one thing that changes it is the size of the reward pool: an empty pool plays at the cap, so right after launch and after a mate most moves play strong until the pool grows.</p>
<p>At 0% the engine plays like a beginner who still sees captures and checks; near the cap, like a strong amateur. Every strength keeps a few seeded mistakes, more at low strength, so games stay lively: even a whale&#39;s move can miss a mate.</p>
<h3 id="the-engine"><a class="docs-anchor" href="#/docs/the-engine" aria-label="Link to this section">#</a>The engine</h3>
<p>The engine is a contract on Ethereum and runs inside the trade that plays the move. It scores every legal move for material, position, pressure on the enemy king and the risk it leaves, and always weighs captures and checks. Higher strength gives the leading candidates more second looks. With a lone enemy king left it plays at full effort to finish the game, and the longer a game goes without a capture or pawn move, the harder it pushes for progress.</p>
<h2 id="checkmate-rewards"><a class="docs-anchor" href="#/docs/checkmate-rewards" aria-label="Link to this section">#</a>Checkmate rewards</h2>
<p>Checkmate wins the jackpot. The owner of the mating move wins from the <strong>losing</strong> team&#39;s reward pool, paid in the losing team&#39;s token: mate for $IMDUEL and you win $IMD; mate for $IMD and you win $IMDUEL. The winning team&#39;s own pool is untouched.</p>
<p>The prize is the smallest of three amounts:</p>
<ol>
<li>a quarter of the losing team&#39;s reward pool;</li>
<li>2x what the mating bid paid;</li>
<li>what this game&#39;s trades paid into the losing team&#39;s reward pool.</li>
</ol>
<p><strong>Example.</strong> $IMDUEL mates. The $IMD reward pool holds 10,000 $IMD, this game&#39;s trades paid 3,000 $IMD into it, and the mating bid paid 1,000 $IMD. The prize is the smallest of 2,500, 2,000 and 3,000: <strong>2,000 $IMD</strong>. The other 8,000 stay in the pool.</p>
<p>So every trade in the game grows the prize, and a bigger bid can win more. Only the mating move&#39;s owner is paid; captures, checks and draws leave the pools to grow until the next mate. The prize is recorded for the owner when the mate is played and waits until they withdraw it (see <a href="#/docs/withdrawing-rewards">Withdrawing rewards</a>).</p>
<p>A mate in one is visible to everyone, so expect a race for it: bots may bid in the window&#39;s last block. Their bids are buys like any other.</p>
<h2 id="games-and-draws"><a class="docs-anchor" href="#/docs/games-and-draws" aria-label="Link to this section">#</a>Games and draws</h2>
<p>A game ends by checkmate or a draw. The board then resets, the teams swap colours and the next trade starts a new game. Reward pools carry over between games.</p>
<p>Draws are automatic:</p>
<ul>
<li>stalemate;</li>
<li>too few pieces to mate (two kings, or a king and one knight or bishop against a king);</li>
<li>the same position for the third time within the last sixteen half-moves (the start position counts from any distance);</li>
<li>60 half-moves without a capture or pawn move;</li>
<li>200 half-moves in total;</li>
<li>the engine failing twice on one position (it never has).</li>
</ul>
<h2 id="fees"><a class="docs-anchor" href="#/docs/fees" aria-label="Link to this section">#</a>Fees</h2>
<p>Every swap in a duel pays two fees:</p>
<table>
<thead>
<tr>
<th>Fee</th>
<th>Rate</th>
<th>Goes to</th>
</tr>
</thead>
<tbody><tr>
<td>Hook fee</td>
<td>0.75%</td>
<td>0.65% to the reward pools, 0.1% burns $IMDUEL</td>
</tr>
<tr>
<td>Pool fee</td>
<td>1.25% in the main duel</td>
<td>the pool&#39;s liquidity: 1% to the launch wallet, 0.25% to the IMD network</td>
</tr>
</tbody></table>
<p>A trade in the main duel costs 2% in fees, plus gas and price impact. Other duels charge the same hook fee and the pool fee their creator chose. Creating a duel costs nothing beyond gas. Every swap emits Uniswap&#39;s standard <code>HookSwap</code> event with the hook fee, so explorers show the full cost.</p>
<h2 id="reward-pools"><a class="docs-anchor" href="#/docs/reward-pools" aria-label="Link to this section">#</a>Reward pools</h2>
<p>Each duel has two reward pools, one per team, in that team&#39;s token.</p>
<ul>
<li><strong>Filled by every trade.</strong> The 0.65% is split: half is taken from what a trade pays, into that token&#39;s pool, and half from what it buys, into the other token&#39;s pool. Every trade feeds both pools by about the same value.</li>
<li><strong>Emptied only by checkmate.</strong> A mate&#39;s prize is the only thing that leaves a pool, and it never takes more than the game paid in, so a pool never ends a game smaller than it started.</li>
<li><strong>Anyone can add to one</strong> with the hook&#39;s <code>fundChest</code>. That raises what a mate against that team wins and makes that team&#39;s bids weaker, since strength is a share of the pool.</li>
</ul>
<h2 id="gas"><a class="docs-anchor" href="#/docs/gas" aria-label="Link to this section">#</a>Gas</h2>
<table>
<thead>
<tr>
<th>Trade</th>
<th>Typical gas</th>
</tr>
</thead>
<tbody><tr>
<td>A trade that only bids</td>
<td>about 180,000</td>
</tr>
<tr>
<td>A trade that plays a move</td>
<td>about 530,000; usually 350,000 to 650,000</td>
</tr>
</tbody></table>
<p>The trade that plays a move runs the engine, so it costs more, whoever sends it. This site sends every trade with a gas limit of 5,000,000, and you pay only for the gas used. If another app sends a trade with a lower limit and bidding closes before it lands, the trade reverts with <code>NotEnoughGas</code> instead of playing a weaker move: only the gas is spent, and it can be sent again with a higher limit.</p>
<h2 id="token-overview"><a class="docs-anchor" href="#/docs/token-overview" aria-label="Link to this section">#</a>Token overview</h2>
<p>$IMDUEL is IMDuel&#39;s token, launched on Ethereum by the IMD swarm together with the hook.</p>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody><tr>
<td>Contract</td>
<td><code>0xc012b8Db13C57beCd950eEfB70540e6f973A3C73</code></td>
</tr>
<tr>
<td>Supply</td>
<td>1,000,000,000, fixed: no minting, no tax, plain transfers</td>
</tr>
<tr>
<td>Pair</td>
<td>$IMDUEL / $IMD, the main duel</td>
</tr>
<tr>
<td>Opening price</td>
<td>2,500 $IMD for the whole supply (1 $IMD = 400,000 $IMDUEL)</td>
</tr>
</tbody></table>
<p>$IMDUEL is a team in the main duel, every duel against $IMDUEL makes it a team there too, and the hook fee of every duel holding $IMDUEL burns it.</p>
<p>Tokens named IMDuel at any other address are not $IMDUEL.</p>
<h2 id="distribution"><a class="docs-anchor" href="#/docs/distribution" aria-label="Link to this section">#</a>Distribution</h2>
<table>
<thead>
<tr>
<th>Share</th>
<th>Goes to</th>
</tr>
</thead>
<tbody><tr>
<td>80%</td>
<td>The main duel&#39;s pool, single-sided: everyone buys from it</td>
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
<td>The launch wallet <code>0x6AA3…5B23</code>: the team, and seeding new features and chain expansions</td>
</tr>
</tbody></table>
<h2 id="burn"><a class="docs-anchor" href="#/docs/burn" aria-label="Link to this section">#</a>Burn</h2>
<p>0.1% of every swap is taken in $IMDUEL wherever a duel holds $IMDUEL, the main duel included, and burned. A duel paired with $IMD that holds no $IMDUEL takes its 0.1% in $IMD and adds it to the main duel&#39;s $IMD reward pool instead.</p>
<p>The burn is owed to <code>0x…dEaD</code> in the hook and sent there by anyone calling <code>withdraw(0x…dEaD, IMDUEL)</code>. The main duel&#39;s page shows the total burned.</p>
<h2 id="trading"><a class="docs-anchor" href="#/docs/trading" aria-label="Link to this section">#</a>Trading</h2>
<p>The site trades through Uniswap&#39;s own contracts, the Universal Router and Permit2.</p>
<ol>
<li><strong>Approve, once per token.</strong> A transaction that lets Permit2 move that token.</li>
<li><strong>Sign a permit.</strong> No gas. It lets the router spend this amount for a short time; skipped while an earlier permit still covers the trade.</li>
<li><strong>Send the trade.</strong> One transaction, with the permit inside it.</li>
</ol>
<p><strong>Slippage.</strong> Auto allows 0.5% plus the largest recent price move within one block in this pool, at most 5%. Other bids for the same move buy the same token, so trades ahead of yours in a block move your price. Whatever you allow is also what a bot trading around yours could take.</p>
<p>Wallets may show the value you receive as $0 until their price services list a new token; the token amount is what counts.</p>
<h2 id="withdrawing-rewards"><a class="docs-anchor" href="#/docs/withdrawing-rewards" aria-label="Link to this section">#</a>Withdrawing rewards</h2>
<p>Rewards are recorded for their owners and never sent inside a trade. <strong>Payouts</strong>, under each duel&#39;s board, shows what is yours with a Withdraw button. Rewards wait as long as you like.</p>
<p>Anyone can call <code>withdraw</code> for an owner, but it only ever pays that owner; <code>withdrawTo</code> lets the owner send to another address. A withdrawal leaves 1 wei behind, which makes the next reward cheaper to record; the site counts it as nothing.</p>
<h2 id="creating-a-duel"><a class="docs-anchor" href="#/docs/creating-a-duel" aria-label="Link to this section">#</a>Creating a duel</h2>
<p><a href="#/create">Create a duel</a> for any ERC-20, or ETH, against $IMD or $IMDUEL.</p>
<ol>
<li>Pick the token, the pair and the pool fee.</li>
<li>Set the starting deposits: they set the opening price and become your liquidity position.</li>
<li>Confirm. If that exact pool already exists, the site opens it instead.</li>
</ol>
<p>A new duel charges the hook fee from its first trade. It must be paired with $IMD or $IMDUEL, so its 0.1% always has somewhere to go; the hook refuses any other pair.</p>
<h2 id="providing-liquidity"><a class="docs-anchor" href="#/docs/providing-liquidity" aria-label="Link to this section">#</a>Providing liquidity</h2>
<p>The Pool switch on a duel&#39;s panel adds liquidity to its Uniswap pool. Liquidity earns the pool fee, shared by size; the hook fee goes to the game, not to liquidity. Your position is a Uniswap position NFT in your wallet, and it has no effect on anyone&#39;s strength or rewards.</p>
<h2 id="profiles-and-leaderboard"><a class="docs-anchor" href="#/docs/profiles-and-leaderboard" aria-label="Link to this section">#</a>Profiles and leaderboard</h2>
<p>Every address has a profile at <code>#/profile/0x…</code>: press an address anywhere on the site, or rest on it for a summary card. It shows what the hook counts for that address in the main duel (games, moves by piece, pieces taken, checks, castles, promotions, checkmates and amounts won) and the badges those counts earn. Names and avatars come from ENS.</p>
<p>The <a href="#/leaderboard">Leaderboard</a> ranks every main-duel player by badges, checkmates, moves, pieces taken or games. Badges are computed from the hook&#39;s counts and are not minted. Only the main duel counts.</p>
<h2 id="contracts"><a class="docs-anchor" href="#/docs/contracts" aria-label="Link to this section">#</a>Contracts</h2>
<p>All on Ethereum mainnet.</p>
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
<td>$IMDUEL</td>
<td><a href="https://etherscan.io/address/0xc012b8Db13C57beCd950eEfB70540e6f973A3C73"><code>0xc012b8Db13C57beCd950eEfB70540e6f973A3C73</code></a></td>
</tr>
<tr>
<td>Main duel (pool id)</td>
<td><code>0xbb45eacf50b4bd8ce31e0620e14ff6e6b6375d56fce4372d3046f4a02faeae65</code></td>
</tr>
<tr>
<td>Launch wallet</td>
<td><code>0x6AA302EFf055259c9Cf177f33Ae3cBA5d4135B23</code></td>
</tr>
</tbody></table>
<p>Deployed through IMD launch 2843 (<a href="https://explorer.imd.fun/jobs/4098dafa-99b4-4c9f-97e3-430b49ea6afa">job 4098dafa</a>) at block 26,322,077. The deployed source is in <a href="https://github.com/identity-md-launches/launch-2843-launch-imduel-imduel-launch-json">the swarm&#39;s launch repository</a>.</p>
<h2 id="reading-a-duel"><a class="docs-anchor" href="#/docs/reading-a-duel" aria-label="Link to this section">#</a>Reading a duel</h2>
<p>A duel is identified by its Uniswap pool id. Team 0 is <code>currency0</code>&#39;s, team 1 <code>currency1</code>&#39;s.</p>
<table>
<thead>
<tr>
<th>Function</th>
<th>Returns</th>
</tr>
</thead>
<tbody><tr>
<td><code>game(poolId)</code></td>
<td>the board, the side to move, both top bids, the bidding window and the last move</td>
</tr>
<tr>
<td><code>chest(poolId, team)</code></td>
<td>a team&#39;s reward pool</td>
</tr>
<tr>
<td><code>gameInflow(poolId, gameNo)</code></td>
<td>what a game&#39;s trades paid into each reward pool</td>
</tr>
<tr>
<td><code>previewMove(poolId, hash)</code></td>
<td>the move a closed window will play, given its last block&#39;s hash</td>
</tr>
<tr>
<td><code>owed(owner, currencyId)</code></td>
<td>rewards waiting to be withdrawn</td>
</tr>
<tr>
<td><code>stats(address)</code></td>
<td>a player&#39;s main-duel counts, in two packed words</td>
</tr>
<tr>
<td><code>players(i)</code>, <code>playerCount()</code></td>
<td>every address that has owned a played move in the main duel</td>
</tr>
<tr>
<td><code>MATE_SHARE_BPS</code>, <code>PAYOUT_CAP</code>, <code>MATE_INFLOW_CAP</code></td>
<td>the prize&#39;s three limits: 2,500 (a quarter), 2 (twice the bid), 1 (the game&#39;s pay-in)</td>
</tr>
</tbody></table>
<p>Events: <code>GameStarted</code>, <code>Bid</code>, <code>Moved</code>, <code>MatePaid</code>, <code>GameOver</code>, <code>DrawTriggered</code>, <code>EngineFailed</code>, <code>Withdrawn</code>, <code>ChestFunded</code>, <code>MainDuel</code>, <code>HookSwap</code>.</p>
<h2 id="trading-from-code"><a class="docs-anchor" href="#/docs/trading-from-code" aria-label="Link to this section">#</a>Trading from code</h2>
<p>Any router or aggregator can trade a duel, and every buy bids. The owner of a bid is the address in <code>hookData</code>, 20 bytes packed or 32 bytes ABI-encoded; without it, the owner is the wallet that signed the transaction. Pass it for smart-contract wallets and relayed trades, where the signer isn&#39;t the trader.</p>
<pre class="docs-code"><code>hookData = abi.encodePacked(owner)   // 20 bytes
hookData = abi.encode(owner)         // 32 bytes</code></pre>
<p>Send every trade with a gas limit of at least 5,000,000. Bidding can close between your gas estimate and your block, and then your trade is the one that plays the move: it must have the engine&#39;s full 3,000,000 on hand when it calls it, or it reverts with <code>NotEnoughGas</code>. Unused gas isn&#39;t charged.</p>
<h2 id="audits-and-testing"><a class="docs-anchor" href="#/docs/audits-and-testing" aria-label="Link to this section">#</a>Audits and testing</h2>
<ul>
<li><strong>IMD swarm audits:</strong> <a href="https://explorer.imd.fun/jobs/74895075-9f30-49e2-8c89-ec79383f8102">74895075</a> on this code (1 low fixed, 1 info documented) and <a href="https://explorer.imd.fun/jobs/6acefe89-1311-462a-8f78-5697050c327d">6acefe89</a> on an earlier version (every finding fixed). The launch job audited the code again before deploying; its one change, the <code>NotEnoughGas</code> check, is in the deployed hook.</li>
<li><strong>Invariants and proofs:</strong> what the hook holds equals the reward pools plus the burn plus what is owed, in every currency, and every mate pays exactly the smallest of its three limits. Checked by invariant tests, symbolic proofs and fuzzing with Foundry and Echidna.</li>
<li><strong>No admin:</strong> no owner, pause or upgrade. The hook and the engine are immutable.</li>
<li><strong>Trades never break:</strong> if the engine fails, a seeded legal move is played at 0% instead; if that fails too, the game ends in a draw.</li>
<li><strong>Isolation:</strong> a hostile token can only affect its own duel.</li>
</ul>
<h2 id="risks-and-known-limits"><a class="docs-anchor" href="#/docs/risks-and-known-limits" aria-label="Link to this section">#</a>Risks and known limits</h2>
<ul>
<li><strong>Market risk.</strong> Token prices move, and a bid buys the token at market. Rewards aren&#39;t guaranteed.</li>
<li><strong>Block builders.</strong> Whoever builds a window&#39;s last block can bid in it and try versions of the block for a hash that plays a winning move. It only pays for a large prize, and a mate pays at most 2x what the bid paid.</li>
<li><strong>Reorganisations.</strong> A move is fixed once its window&#39;s last block is in. If the chain replaced that block (rare on Ethereum), the move would change with it.</li>
<li><strong>The last block.</strong> A raise in a window&#39;s last block can&#39;t be answered, and bots that see a mate in one will bid late for it.</li>
<li><strong>Small reward pools.</strong> While a pool is small every bid plays near the cap, and a large donation to a pool makes that team&#39;s bids weaker.</li>
<li><strong>Quiet duels.</strong> A move must be played within about a day (8,191 blocks) of its window closing, while its block hash is still on chain. After that it is drawn again, owned by nobody, at its bid&#39;s strength.</li>
<li><strong>Throwing games.</strong> A team can lose on purpose, but every move costs fees and the prize comes out of its own pool, so it loses money doing it.</li>
<li><strong>Relayed trades.</strong> A trade relayed for a smart-contract wallet without the owner in <code>hookData</code> credits the wallet that signed it.</li>
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
<td>Bid</td>
<td>A buy of a team&#39;s token, for that team&#39;s next move</td>
</tr>
<tr>
<td>Top bid</td>
<td>The bid that paid the most for a move; it owns the move</td>
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
<td>How hard the engine thinks, from the bid&#39;s share of its team&#39;s reward pool</td>
</tr>
<tr>
<td>Reward pool</td>
<td>A team&#39;s prize money, in its own token</td>
</tr>
<tr>
<td>Timeout move</td>
<td>A 0% move owned by nobody, after 10 minutes without a bid</td>
</tr>
<tr>
<td>Hook fee</td>
<td>The 0.75% every swap pays to the game: 0.65% reward pools, 0.1% burn</td>
</tr>
</tbody></table>
`,markdown:`# IMDuel docs

<!-- group: Overview -->

## Introduction

IMDuel is a Uniswap v4 hook that plays chess. Every pool that uses it is a **duel**: its two tokens are two teams, and they play an endless series of chess games against each other.

- **Buying a token is a bid** for its team's next move. The biggest buy owns the move.
- **An onchain engine plays the move.** Nobody picks the square; a bigger buy makes the engine play stronger.
- **Checkmate wins the jackpot.** The owner of the mating move wins from the losing team's reward pool.
- **Every swap pays a 0.75% hook fee.** 0.65% fills the reward pools and 0.1% burns $IMDUEL.

A bid is an ordinary buy: you keep the tokens you bought, and the move comes with it. There is no ticket, no deposit and no separate call.

The main duel is **$IMDUEL / $IMD** on Ethereum. Anyone can create a duel of another token against $IMD or $IMDUEL. The contracts have no owner, no admin key, no pause and no upgrade.

IMDuel is experimental. A bigger buy plays a stronger move but guarantees no mate, win or profit, and token prices move. Trade only what you can afford to lose.

## Quick start

1. **Get a token to pay with.** In the main duel you buy $IMDUEL with $IMD, or $IMD with $IMDUEL. $IMD trades on Uniswap against ETH. You also need ETH for gas.
2. **Connect.** Press Connect in the header and choose your wallet.
3. **Open a duel.** [Duels](#/duels) lists every duel; the main duel is first. Its page shows the board, whose move it is, the top bid and what a checkmate wins now.
4. **Buy for a team.** In the Trade panel, pick the team you back and an amount. The panel shows whether your buy takes the top bid and how strong the move would be.
5. **Watch the move.** About 36 seconds after the previous move, bidding closes and the move is fixed; the next trade in the pool plays it.

<!-- group: How it works -->

## Duels and teams

A duel is a Uniswap v4 pool on the IMDuel hook. Each of its two tokens is a team: buy $IMDUEL to play for $IMDUEL, buy $IMD to play for $IMD. To buy one team's token you pay with the other's, so every trade plays for exactly one team.

Each team has a **reward pool** in its own token, filled by the hook fee on every trade (see [Reward pools](#/docs/reward-pools)).

The teams swap colours every game. In a duel's first game White is the duel's own token and Black the token it is paired against: in the main duel, $IMDUEL plays White.

## Bidding

<div data-walkthrough></div>

Every buy of a team's token bids for that team's next move: the move being decided if it is that team's turn, otherwise its following move. There is no minimum, and it doesn't matter which app or aggregator sends the trade.

- **The top bid owns the move.** Bids are compared by what the trade paid. To take the top spot, a buy must pay more than 10% over the current top bid; smaller buys just trade.
- **The owner** is the address the trade names. Trading on this site names you; a trade from another app names the wallet that signed it (see [Trading from code](#/docs/trading-from-code)).
- **Bidding lasts 3 blocks** after the previous move is played, about 36 seconds on Ethereum. If a move's first bid comes in the last of those blocks or later, bidding stays open for 3 blocks from that bid, so the other bidders can always answer.
- **Bids carry over.** A bid for a move the game never reaches owns its team's first move of the next game.

## Moves

When bidding closes, the hash of the window's last block seeds the engine. That hash doesn't exist while anyone can still bid, so no bidder can know which move their bid will play. Once that block is mined the move is fixed, and the site shows it before it is played.

The first trade after bidding closes plays the move. It can come from either team and be any size; it doesn't change the move, but it pays the engine's gas (see [Gas](#/docs/gas)).

**Timeouts.** If the side to move gets no bid for 10 minutes, a trade by the other team opens that move at 0% strength, owned by nobody. A real bid in the same block takes it over. A move owned by nobody wins nothing, even if it mates.

## Strength

Strength is how hard the engine thinks about a move. It comes from the tokens the owning buy received, compared with its own team's reward pool, which is in the same token:

| Tokens received, as a share of the team's reward pool | Strength |
| --- | --- |
| 0.1% or less | 0% |
| 1% | 30% |
| 10% | 60% |
| The whole reward pool or more | 90% (the cap) |

Strength reads no price and no liquidity, so nothing outside the game can make a bid stronger or weaker. The one thing that changes it is the size of the reward pool: an empty pool plays at the cap, so right after launch and after a mate most moves play strong until the pool grows.

At 0% the engine plays like a beginner who still sees captures and checks; near the cap, like a strong amateur. Every strength keeps a few seeded mistakes, more at low strength, so games stay lively: even a whale's move can miss a mate.

### The engine

The engine is a contract on Ethereum and runs inside the trade that plays the move. It scores every legal move for material, position, pressure on the enemy king and the risk it leaves, and always weighs captures and checks. Higher strength gives the leading candidates more second looks. With a lone enemy king left it plays at full effort to finish the game, and the longer a game goes without a capture or pawn move, the harder it pushes for progress.

## Checkmate rewards

Checkmate wins the jackpot. The owner of the mating move wins from the **losing** team's reward pool, paid in the losing team's token: mate for $IMDUEL and you win $IMD; mate for $IMD and you win $IMDUEL. The winning team's own pool is untouched.

The prize is the smallest of three amounts:

1. a quarter of the losing team's reward pool;
2. 2x what the mating bid paid;
3. what this game's trades paid into the losing team's reward pool.

**Example.** $IMDUEL mates. The $IMD reward pool holds 10,000 $IMD, this game's trades paid 3,000 $IMD into it, and the mating bid paid 1,000 $IMD. The prize is the smallest of 2,500, 2,000 and 3,000: **2,000 $IMD**. The other 8,000 stay in the pool.

So every trade in the game grows the prize, and a bigger bid can win more. Only the mating move's owner is paid; captures, checks and draws leave the pools to grow until the next mate. The prize is recorded for the owner when the mate is played and waits until they withdraw it (see [Withdrawing rewards](#/docs/withdrawing-rewards)).

A mate in one is visible to everyone, so expect a race for it: bots may bid in the window's last block. Their bids are buys like any other.

## Games and draws

A game ends by checkmate or a draw. The board then resets, the teams swap colours and the next trade starts a new game. Reward pools carry over between games.

Draws are automatic:

- stalemate;
- too few pieces to mate (two kings, or a king and one knight or bishop against a king);
- the same position for the third time within the last sixteen half-moves (the start position counts from any distance);
- 60 half-moves without a capture or pawn move;
- 200 half-moves in total;
- the engine failing twice on one position (it never has).

<!-- group: Economics -->

## Fees

Every swap in a duel pays two fees:

| Fee | Rate | Goes to |
| --- | --- | --- |
| Hook fee | 0.75% | 0.65% to the reward pools, 0.1% burns $IMDUEL |
| Pool fee | 1.25% in the main duel | the pool's liquidity: 1% to the launch wallet, 0.25% to the IMD network |

A trade in the main duel costs 2% in fees, plus gas and price impact. Other duels charge the same hook fee and the pool fee their creator chose. Creating a duel costs nothing beyond gas. Every swap emits Uniswap's standard \`HookSwap\` event with the hook fee, so explorers show the full cost.

## Reward pools

Each duel has two reward pools, one per team, in that team's token.

- **Filled by every trade.** The 0.65% is split: half is taken from what a trade pays, into that token's pool, and half from what it buys, into the other token's pool. Every trade feeds both pools by about the same value.
- **Emptied only by checkmate.** A mate's prize is the only thing that leaves a pool, and it never takes more than the game paid in, so a pool never ends a game smaller than it started.
- **Anyone can add to one** with the hook's \`fundChest\`. That raises what a mate against that team wins and makes that team's bids weaker, since strength is a share of the pool.

## Gas

| Trade | Typical gas |
| --- | --- |
| A trade that only bids | about 180,000 |
| A trade that plays a move | about 530,000; usually 350,000 to 650,000 |

The trade that plays a move runs the engine, so it costs more, whoever sends it. This site sends every trade with a gas limit of 5,000,000, and you pay only for the gas used. If another app sends a trade with a lower limit and bidding closes before it lands, the trade reverts with \`NotEnoughGas\` instead of playing a weaker move: only the gas is spent, and it can be sent again with a higher limit.

<!-- group: $IMDUEL -->

## Token overview

$IMDUEL is IMDuel's token, launched on Ethereum by the IMD swarm together with the hook.

| | |
| --- | --- |
| Contract | \`0xc012b8Db13C57beCd950eEfB70540e6f973A3C73\` |
| Supply | 1,000,000,000, fixed: no minting, no tax, plain transfers |
| Pair | $IMDUEL / $IMD, the main duel |
| Opening price | 2,500 $IMD for the whole supply (1 $IMD = 400,000 $IMDUEL) |

$IMDUEL is a team in the main duel, every duel against $IMDUEL makes it a team there too, and the hook fee of every duel holding $IMDUEL burns it.

Tokens named IMDuel at any other address are not $IMDUEL.

## Distribution

| Share | Goes to |
| --- | --- |
| 80% | The main duel's pool, single-sided: everyone buys from it |
| 8% | IMD seats connected at launch, shared equally (the swarm's airdrop) |
| 2% | Wallets that worked on the launch (the swarm's airdrop) |
| 10% | The launch wallet \`0x6AA3…5B23\`: the team, and seeding new features and chain expansions |

## Burn

0.1% of every swap is taken in $IMDUEL wherever a duel holds $IMDUEL, the main duel included, and burned. A duel paired with $IMD that holds no $IMDUEL takes its 0.1% in $IMD and adds it to the main duel's $IMD reward pool instead.

The burn is owed to \`0x…dEaD\` in the hook and sent there by anyone calling \`withdraw(0x…dEaD, IMDUEL)\`. The main duel's page shows the total burned.

<!-- group: Guides -->

## Trading

The site trades through Uniswap's own contracts, the Universal Router and Permit2.

1. **Approve, once per token.** A transaction that lets Permit2 move that token.
2. **Sign a permit.** No gas. It lets the router spend this amount for a short time; skipped while an earlier permit still covers the trade.
3. **Send the trade.** One transaction, with the permit inside it.

**Slippage.** Auto allows 0.5% plus the largest recent price move within one block in this pool, at most 5%. Other bids for the same move buy the same token, so trades ahead of yours in a block move your price. Whatever you allow is also what a bot trading around yours could take.

Wallets may show the value you receive as $0 until their price services list a new token; the token amount is what counts.

## Withdrawing rewards

Rewards are recorded for their owners and never sent inside a trade. **Payouts**, under each duel's board, shows what is yours with a Withdraw button. Rewards wait as long as you like.

Anyone can call \`withdraw\` for an owner, but it only ever pays that owner; \`withdrawTo\` lets the owner send to another address. A withdrawal leaves 1 wei behind, which makes the next reward cheaper to record; the site counts it as nothing.

## Creating a duel

[Create a duel](#/create) for any ERC-20, or ETH, against $IMD or $IMDUEL.

1. Pick the token, the pair and the pool fee.
2. Set the starting deposits: they set the opening price and become your liquidity position.
3. Confirm. If that exact pool already exists, the site opens it instead.

A new duel charges the hook fee from its first trade. It must be paired with $IMD or $IMDUEL, so its 0.1% always has somewhere to go; the hook refuses any other pair.

## Providing liquidity

The Pool switch on a duel's panel adds liquidity to its Uniswap pool. Liquidity earns the pool fee, shared by size; the hook fee goes to the game, not to liquidity. Your position is a Uniswap position NFT in your wallet, and it has no effect on anyone's strength or rewards.

## Profiles and leaderboard

Every address has a profile at \`#/profile/0x…\`: press an address anywhere on the site, or rest on it for a summary card. It shows what the hook counts for that address in the main duel (games, moves by piece, pieces taken, checks, castles, promotions, checkmates and amounts won) and the badges those counts earn. Names and avatars come from ENS.

The [Leaderboard](#/leaderboard) ranks every main-duel player by badges, checkmates, moves, pieces taken or games. Badges are computed from the hook's counts and are not minted. Only the main duel counts.

<!-- group: Developers -->

## Contracts

All on Ethereum mainnet.

| Contract | Address |
| --- | --- |
| IMDuelHook | [\`0xA92F72DcDd90229C32F6d51229F4cc5c916410CC\`](https://etherscan.io/address/0xA92F72DcDd90229C32F6d51229F4cc5c916410CC) |
| ChessEngineV5 | [\`0xc21788F704a8b9456f7391A01d8a3D95Be215a27\`](https://etherscan.io/address/0xc21788F704a8b9456f7391A01d8a3D95Be215a27) |
| $IMDUEL | [\`0xc012b8Db13C57beCd950eEfB70540e6f973A3C73\`](https://etherscan.io/address/0xc012b8Db13C57beCd950eEfB70540e6f973A3C73) |
| Main duel (pool id) | \`0xbb45eacf50b4bd8ce31e0620e14ff6e6b6375d56fce4372d3046f4a02faeae65\` |
| Launch wallet | \`0x6AA302EFf055259c9Cf177f33Ae3cBA5d4135B23\` |

Deployed through IMD launch 2843 ([job 4098dafa](https://explorer.imd.fun/jobs/4098dafa-99b4-4c9f-97e3-430b49ea6afa)) at block 26,322,077. The deployed source is in [the swarm's launch repository](https://github.com/identity-md-launches/launch-2843-launch-imduel-imduel-launch-json).

## Reading a duel

A duel is identified by its Uniswap pool id. Team 0 is \`currency0\`'s, team 1 \`currency1\`'s.

| Function | Returns |
| --- | --- |
| \`game(poolId)\` | the board, the side to move, both top bids, the bidding window and the last move |
| \`chest(poolId, team)\` | a team's reward pool |
| \`gameInflow(poolId, gameNo)\` | what a game's trades paid into each reward pool |
| \`previewMove(poolId, hash)\` | the move a closed window will play, given its last block's hash |
| \`owed(owner, currencyId)\` | rewards waiting to be withdrawn |
| \`stats(address)\` | a player's main-duel counts, in two packed words |
| \`players(i)\`, \`playerCount()\` | every address that has owned a played move in the main duel |
| \`MATE_SHARE_BPS\`, \`PAYOUT_CAP\`, \`MATE_INFLOW_CAP\` | the prize's three limits: 2,500 (a quarter), 2 (twice the bid), 1 (the game's pay-in) |

Events: \`GameStarted\`, \`Bid\`, \`Moved\`, \`MatePaid\`, \`GameOver\`, \`DrawTriggered\`, \`EngineFailed\`, \`Withdrawn\`, \`ChestFunded\`, \`MainDuel\`, \`HookSwap\`.

## Trading from code

Any router or aggregator can trade a duel, and every buy bids. The owner of a bid is the address in \`hookData\`, 20 bytes packed or 32 bytes ABI-encoded; without it, the owner is the wallet that signed the transaction. Pass it for smart-contract wallets and relayed trades, where the signer isn't the trader.

\`\`\`
hookData = abi.encodePacked(owner)   // 20 bytes
hookData = abi.encode(owner)         // 32 bytes
\`\`\`

Send every trade with a gas limit of at least 5,000,000. Bidding can close between your gas estimate and your block, and then your trade is the one that plays the move: it must have the engine's full 3,000,000 on hand when it calls it, or it reverts with \`NotEnoughGas\`. Unused gas isn't charged.

<!-- group: Security -->

## Audits and testing

- **IMD swarm audits:** [74895075](https://explorer.imd.fun/jobs/74895075-9f30-49e2-8c89-ec79383f8102) on this code (1 low fixed, 1 info documented) and [6acefe89](https://explorer.imd.fun/jobs/6acefe89-1311-462a-8f78-5697050c327d) on an earlier version (every finding fixed). The launch job audited the code again before deploying; its one change, the \`NotEnoughGas\` check, is in the deployed hook.
- **Invariants and proofs:** what the hook holds equals the reward pools plus the burn plus what is owed, in every currency, and every mate pays exactly the smallest of its three limits. Checked by invariant tests, symbolic proofs and fuzzing with Foundry and Echidna.
- **No admin:** no owner, pause or upgrade. The hook and the engine are immutable.
- **Trades never break:** if the engine fails, a seeded legal move is played at 0% instead; if that fails too, the game ends in a draw.
- **Isolation:** a hostile token can only affect its own duel.

## Risks and known limits

- **Market risk.** Token prices move, and a bid buys the token at market. Rewards aren't guaranteed.
- **Block builders.** Whoever builds a window's last block can bid in it and try versions of the block for a hash that plays a winning move. It only pays for a large prize, and a mate pays at most 2x what the bid paid.
- **Reorganisations.** A move is fixed once its window's last block is in. If the chain replaced that block (rare on Ethereum), the move would change with it.
- **The last block.** A raise in a window's last block can't be answered, and bots that see a mate in one will bid late for it.
- **Small reward pools.** While a pool is small every bid plays near the cap, and a large donation to a pool makes that team's bids weaker.
- **Quiet duels.** A move must be played within about a day (8,191 blocks) of its window closing, while its block hash is still on chain. After that it is drawn again, owned by nobody, at its bid's strength.
- **Throwing games.** A team can lose on purpose, but every move costs fees and the prize comes out of its own pool, so it loses money doing it.
- **Relayed trades.** A trade relayed for a smart-contract wallet without the owner in \`hookData\` credits the wallet that signed it.

<!-- group: Reference -->

## Glossary

| Term | Meaning |
| --- | --- |
| Duel | A Uniswap v4 pool on the IMDuel hook; its two tokens are the teams |
| Bid | A buy of a team's token, for that team's next move |
| Top bid | The bid that paid the most for a move; it owns the move |
| Owner | The address the top bid named; it wins the prize if its move mates |
| Window | The blocks during which a move takes bids |
| Strength | How hard the engine thinks, from the bid's share of its team's reward pool |
| Reward pool | A team's prize money, in its own token |
| Timeout move | A 0% move owned by nobody, after 10 minutes without a bid |
| Hook fee | The 0.75% every swap pays to the game: 0.65% reward pools, 0.1% burn |
`,toc:[{group:`Overview`,sections:[{id:`introduction`,title:`Introduction`,sub:[]},{id:`quick-start`,title:`Quick start`,sub:[]}]},{group:`How it works`,sections:[{id:`duels-and-teams`,title:`Duels and teams`,sub:[]},{id:`bidding`,title:`Bidding`,sub:[]},{id:`moves`,title:`Moves`,sub:[]},{id:`strength`,title:`Strength`,sub:[{id:`the-engine`,title:`The engine`}]},{id:`checkmate-rewards`,title:`Checkmate rewards`,sub:[]},{id:`games-and-draws`,title:`Games and draws`,sub:[]}]},{group:`Economics`,sections:[{id:`fees`,title:`Fees`,sub:[]},{id:`reward-pools`,title:`Reward pools`,sub:[]},{id:`gas`,title:`Gas`,sub:[]}]},{group:`$IMDUEL`,sections:[{id:`token-overview`,title:`Token overview`,sub:[]},{id:`distribution`,title:`Distribution`,sub:[]},{id:`burn`,title:`Burn`,sub:[]}]},{group:`Guides`,sections:[{id:`trading`,title:`Trading`,sub:[]},{id:`withdrawing-rewards`,title:`Withdrawing rewards`,sub:[]},{id:`creating-a-duel`,title:`Creating a duel`,sub:[]},{id:`providing-liquidity`,title:`Providing liquidity`,sub:[]},{id:`profiles-and-leaderboard`,title:`Profiles and leaderboard`,sub:[]}]},{group:`Developers`,sections:[{id:`contracts`,title:`Contracts`,sub:[]},{id:`reading-a-duel`,title:`Reading a duel`,sub:[]},{id:`trading-from-code`,title:`Trading from code`,sub:[]}]},{group:`Security`,sections:[{id:`audits-and-testing`,title:`Audits and testing`,sub:[]},{id:`risks-and-known-limits`,title:`Risks and known limits`,sub:[]}]},{group:`Reference`,sections:[{id:`glossary`,title:`Glossary`,sub:[]}]}]},h=(e,t)=>{let a=t.params.section;n(e,i`<div class="overview wrap">${s(`Docs`,{href:`#/`,label:`Home`},{lede:`How IMDuel works: the game, the money, the site and the contracts.`,end:r({label:`Find a duel`,href:`#/duels`,tone:`ink`,size:`sm`}),className:`overview-title`})}
    ${l(m,a)}</div>`);let o=e.querySelector(`[data-walkthrough]`);o&&n(o,f());let c=o?p(o.querySelector(`.walkthrough`)):void 0,d=u(e,m,a);return()=>{d(),c?.()}};export{h as default};