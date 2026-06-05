export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  content: string;
};

export const BLOGS: BlogPost[] = [
  {
    slug: "websockets-from-scratch-no-library",
    title: "WebSockets From Scratch, No Library",
    excerpt:
      "Most developers use Socket.io and never look under the hood. Here is what is actually happening when two machines talk in real time.",
    date: "2026-06-05",
    content: `
      <p>Every time you see a live notification, a real-time cursor, or a chat message appear without refreshing the page, WebSockets are probably involved. Most tutorials hand you Socket.io and call it a day. This post skips the library and goes straight to the protocol.</p>
  
      <h2>Why Not Just HTTP?</h2>
      <p>HTTP is a request-response protocol. The client asks, the server answers, and the connection closes. That model works fine for fetching a webpage, but it falls apart the moment you need the server to push data without the client asking first. Long-polling was the workaround people used before WebSockets existed. The client would send a request, the server would hold it open until something happened, respond, and then the client would immediately send another request. It worked, barely, and it was expensive.</p>
      <p>WebSockets solve this cleanly. One handshake, and both sides can send data whenever they want for as long as the connection stays open.</p>
  
      <h2>The Handshake</h2>
      <p>A WebSocket connection does not start as a WebSocket connection. It starts as a plain HTTP request. The client sends a regular GET request but includes a special header signaling that it wants to upgrade the protocol. It also sends a randomly generated base64 key.</p>
      <p>The server responds with a 101 Switching Protocols status. Before it does, it takes the client's key, appends a fixed magic string defined in the spec, runs a SHA-1 hash on the result, and sends back the base64 encoding of that hash. This is not encryption. It is just proof that the server genuinely understands the WebSocket protocol and is not accidentally replying to the wrong kind of request.</p>
      <p>Once the client validates that response, the HTTP connection is handed over entirely. Both sides are now speaking WebSocket framing over the same TCP connection that started the conversation.</p>
  
      <h2>Frames</h2>
      <p>Data over a WebSocket travels in frames, not as a raw stream. Every message is wrapped in a small binary header before being sent across the wire. That header carries a few important pieces of information: whether this is the last fragment of a larger message, what type of data is inside, whether the payload is masked, and how long the payload is.</p>
      <p>The type information is called an opcode. Text messages, binary messages, connection closes, pings, and pongs each have their own opcode. Ping and pong are built directly into the protocol as a keep-alive mechanism. Either side can send a ping at any time and the other side is expected to respond with a pong. This is how dropped connections get detected before either side tries to send real data into a void.</p>
  
      <h2>Masking</h2>
      <p>Every frame sent from a client to a server must be masked. This is not optional and it is not about security in the traditional sense. It exists to protect infrastructure. Older proxies and caches sitting between a client and a server were not built with WebSockets in mind. If unmasked data happened to look like an HTTP response, a caching proxy could store it and serve it to other users. Masking makes the payload look like noise to anything that does not understand the WebSocket protocol.</p>
      <p>The client generates a four byte key and XORs each byte of the payload with the corresponding key byte, cycling through the key as needed. The server knows to reverse this before reading the message. Frames going from server to client are never masked.</p>
  
      <h2>Message Fragmentation</h2>
      <p>Large messages do not have to be sent as one frame. The protocol supports fragmentation, where a single logical message is split across multiple frames. The first frame signals that more is coming, intermediate frames carry continuation opcodes, and the final frame sets a flag indicating the message is complete. The receiver reassembles them in order. This matters in practice because it allows a sender to start streaming data before it knows the full size of what it is sending.</p>
  
      <h2>Closing the Connection</h2>
      <p>Closing a WebSocket connection is a two step process. The side that wants to close sends a close frame, optionally with a status code and a reason. The other side responds with its own close frame, and then the underlying TCP connection is torn down. This graceful shutdown exists so neither side drops data that was already in flight when the decision to close was made.</p>
  
      <h2>Where Libraries Fit In</h2>
      <p>Libraries like Socket.io are built on top of all of this. They add rooms, namespaces, automatic reconnection, and a fallback to long-polling when WebSockets are not available. That is genuinely useful. But they are abstractions over a protocol that is already fairly simple. Understanding the layer underneath means you can reason about latency, debug unexpected disconnects, implement the protocol in environments where no library exists, and make informed decisions about when a library is actually solving a problem versus adding weight.</p>
      <p>The WebSocket spec is short and readable. The handshake is a few headers. The framing is a handful of bit manipulations. Everything else, broadcasts, rooms, presence, is application logic that you build on top.</p>
    `,
  },
  {
    slug: "the-hidden-cost-of-automation-nobody-talks-about",
    title: "The Hidden Cost of Automation Nobody Talks About",
    excerpt:
      "What we give up when we automate too much, too soon.",
    date: "2026-02-03",
    content: `
        <p><em>We measure what automation saves — time, money, headcount. We rarely measure what it quietly takes away.</em></p>
 
  <p>We love a good efficiency story. A company automates its invoice processing, cuts turnaround from three days to three minutes, and everyone applauds. A developer uses AI to ship a feature in two hours that used to take two days, and the productivity charts go vertical. The ROI is obvious, the savings are real, and the press release writes itself.</p>
 
  <p>But automation has a ledger with two columns. We obsess over the left one — what we gain. We almost never read the right one — what we lose. And the right column is filling up fast.</p>
 
  <h2>The skills we stop building</h2>
 
  <p>Here is a quiet experiment happening across a generation of developers right now. Junior engineers are entering their first jobs at a moment when AI copilots can write boilerplate, suggest functions, explain errors, and even review pull requests. The workflow is genuinely faster. The problem is that the struggle — the frustrated debugging session at 11 PM, the moment you finally understand why your recursive function was blowing the stack — was never just inefficiency. It was the lesson.</p>
 
  <p>When automation removes friction, it often removes the thing that created competence. Pilots who rely too heavily on autopilot systems lose proficiency in manual flying — a well-documented phenomenon aviation regulators call "skill fade." Surgeons who trained on robotic systems show weaker performance on conventional procedures. The pattern repeats across domains: remove the hard way of doing something, and the hard way becomes inaccessible.</p>
 
  <blockquote>
    <p>"The struggle wasn't just inefficiency. It was the lesson. When we automate the friction away, we sometimes automate the learning away with it."</p>
  </blockquote>
 
  <p>This is not an argument against learning with tools. It is an argument for being honest about what tool-assisted learning can and cannot produce. A developer who has only ever used AI to debug code has not developed a debugging mental model — they have developed a prompting reflex. Those are different skills, and only one of them generalizes to novel problems.</p>
 
  <h2>The invisible unemployment nobody counts</h2>
 
  <p>Official unemployment numbers track people who have lost jobs. They do not track people whose jobs have been quietly hollowed out — the worker who still shows up, still collects a salary, but whose actual skill set is no longer being exercised because software now handles the interesting parts.</p>
 
  <p>The World Economic Forum estimates around 85 million jobs were displaced by automation by 2025, with 97 million new roles emerging in their place. Around 40% of workers may need significant reskilling within the next five years. The net numbers look optimistic. But they obscure something important: the transition is not clean, and it is not evenly distributed. The person who was an expert accounts payable specialist for fifteen years does not automatically become a data analyst because the economy now needs more of those. The gap between displaced skills and demanded skills is wide, and crossing it requires time, resources, and access that many workers simply do not have.</p>
 
  <p>Automation does not just change what work looks like. It changes who gets to do valuable work at all — and on what timeline. The macro numbers balance. The individual lives often do not.</p>
 
  <h2>The cognitive offloading problem</h2>
 
  <p>There is a concept in cognitive science called the extended mind — the idea that we use tools, notebooks, and devices as external components of our thinking. Automation is the most powerful extension of mind humanity has ever built. The question is what happens when the tool becomes so capable that the internal component atrophies.</p>
 
  <p>Navigation apps are a clean case study. Studies consistently show that regular GPS users demonstrate reduced hippocampal activation during navigation tasks and perform worse on route recall without assistance. The map app is not just helping you get somewhere — it is doing the spatial reasoning your brain used to do. And spatial reasoning, like any cognitive capacity, weakens without use.</p>
 
  <p>Scale this up. Automate writing, automate research, automate analysis, automate decisions. Each delegation is individually rational and collectively concerning. The question is not whether any particular tool is good or bad. It is whether we are building a civilization where the baseline capacity of an unassisted human is quietly declining — and what we will do when the systems fail, or when they are wrong, and the humans in the loop no longer have the depth to catch it.</p>
 
  <blockquote>
    <p>"Every time we delegate a cognitive task permanently, we are making a bet that we will never need to do that task without help. History suggests we should bet more carefully."</p>
  </blockquote>
 
  <h2>The concentration of gains</h2>
 
  <p>Automation's productivity gains do not distribute themselves. They flow to whoever owns the automated system. This is not a new observation, but it has become more acute as the cost of building powerful automation has dropped dramatically while the cost of being automated has stayed constant — or risen.</p>
 
  <p>A small team can now build software that replaces a medium-sized firm's workforce. The team captures enormous value. The replaced workforce captures the social safety net, which in most countries was designed for a different economic era. The mismatch between how fast automation moves and how slowly institutions adapt is where the hidden cost lives most dangerously.</p>
 
  <h2>What honest accounting looks like</h2>
 
  <p>None of this is an argument for slowing automation down. It is an argument for measuring it completely. When a company announces it is automating a process, the real cost-benefit analysis should include: what skills will atrophy? Who bears the transition cost? What happens to systemic resilience when humans are removed from these loops?</p>
 
  <p>When developers adopt AI tools — as they should — the honest accounting includes: am I getting faster, or am I getting shallower? Are these tools amplifying my judgment, or replacing the need to develop it?</p>
 
  <p>Automation is not going to stop. The question is whether we build it with eyes open to the full ledger, or whether we keep celebrating the left column while the right column fills in silence.</p>
 
  <p><em>The most expensive things in any system are the costs that do not appear on the invoice.</em></p>
    `,
  },
  {
    slug: "what-i-wish-i-knew-before-graduating",
    title: "What I Wish I Knew Before Graduating",
    excerpt:
      "A few things that would have made the jump from college to industry a bit smoother.",
    date: "2026-02-20",
    content: `
            <p>Let me be direct about something that took me two years to fully accept: the placement system at most tier-3 colleges in India is not a meritocracy. It is a lottery with a CGPA filter at the door. And the sooner you understand that, the less time you waste believing the game is fair.</p>
 
      <p>I built projects. I ground through LeetCode. I learned the stack companies actually use in production. None of that moved the needle inside my college's placement process. What moved the needle — the only thing that consistently moved the needle — was a number. Seven point five or above, and doors opened. Below that, you were invisible. Skills were irrelevant.</p>
 
      <h2>The CGPA game nobody admits to</h2>
 
      <p>Here is what actually happens during campus placement season. A recruiter sends a job description to the Training and Placement cell. The T&P cell runs a CGPA cutoff — 7.0, 7.5, sometimes 8.0. Everyone above the line gets an email. Everyone below the line never finds out the company visited. No portfolio review. No GitHub profile. No side projects. Just a number from semesters where the exam questions were leaked or curved anyway.</p>
 
      <p>I watched classmates who could not write a working for-loop get placed at IT service companies because they had a 8.2. I watched people who had shipped real products to real users get rejected at the shortlisting stage because they had a 6.9. The correlation between CGPA and placement outcomes at my college was strong. The correlation between actual ability and placement outcomes was close to zero.</p>
 
      <blockquote>"The system was never designed to find the best engineers. It was designed to process bodies into seats as efficiently as possible."</blockquote>
 
      <h2>Placement season is exhausting — and it is a scam</h2>
 
      <p>I will use that word deliberately. Scam. Not because companies are fraudulent, but because the entire performance around campus recruitment is built on a false promise. Colleges advertise placement percentages in brochures. They count every student who gets placed, even in roles paying ₹2.5 LPA for service-desk work that has nothing to do with the degree. The number looks impressive. The reality does not.</p>
 
      <div class="callout">
        <strong>The placement percentage lie:</strong> When your college says "82% placed," ask what percentage were placed in roles requiring the skills they spent four years learning. The answer is almost always a much smaller, much quieter number.
      </div>
 
      <p>The season itself is months of opening the same portal every morning, watching the same companies visit, attending pre-placement talks designed to make you feel lucky for the opportunity to apply, and then hearing nothing. It is demoralizing by design — or at least demoralizing by indifference, which amounts to the same thing.</p>
 
      <h2>What I wish I had done certain things differently</h2>
 
      <p>I wish I had understood earlier that the job market outside campus is a completely different game. On the open market, a well-built project, a clean GitHub, a thoughtful portfolio, and the ability to talk technically about your own work matters enormously. The CGPA filter still exists at some companies — but it competes with actual evidence of competence rather than replacing it.</p>
 
      <p>The best thing you can do in a tier-3 college is stop optimizing for the placement process and start building for the world outside it. Build things. Write about what you build. Put it where people can find it. The campus placement system was not built for you — it was built for the college's marketing brochure.</p>
 
      <p>Your skills are real. The system just was not designed to see them. Build in the open until the right people can.</p>
 
      <div class="closing">
        <p>This is one student's experience at one university. But I suspect it is not one student's problem.</p>
      </div>
    `,
  },
];

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return BLOGS.find((b) => b.slug === slug);
}
