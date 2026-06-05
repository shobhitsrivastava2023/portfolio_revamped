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
      <p>HTTP is a request-response protocol. The client asks, the server answers, and the connection closes. That model works fine for fetching a webpage, but it breaks down the moment you need the server to push data to the client without the client asking first. Long-polling is the hack people used before WebSockets existed, and it is exactly as ugly as it sounds.</p>
      <p>WebSockets solve this by keeping the connection open. One handshake, then both sides can send frames whenever they want.</p>
  
      <h2>The Handshake</h2>
      <p>A WebSocket connection starts as a plain HTTP request. The client sends an upgrade request that looks something like this:</p>
      <pre><code>GET /chat HTTP/1.1
  Host: example.com
  Upgrade: websocket
  Connection: Upgrade
  Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
  Sec-WebSocket-Version: 13</code></pre>
      <p>The server responds with a 101 Switching Protocols status and a derived key to confirm the upgrade. The key derivation is not encryption, it is just a way to prove the server understood the request. The server takes the client key, appends a fixed GUID, SHA-1 hashes it, and base64 encodes the result.</p>
      <pre><code>HTTP/1.1 101 Switching Protocols
  Upgrade: websocket
  Connection: Upgrade
  Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=</code></pre>
      <p>After this exchange, the HTTP connection is hijacked. Both sides are now speaking the WebSocket framing protocol over the same TCP connection.</p>
  
      <h2>Frames, Not Streams</h2>
      <p>Data over a WebSocket is sent in frames. Each frame has a small binary header followed by the payload. The first byte encodes whether this is the final fragment of a message and what opcode it carries. The second byte encodes whether the payload is masked and the payload length.</p>
      <p>Opcodes are worth knowing. <code>0x1</code> is a text frame, <code>0x2</code> is binary, <code>0x8</code> is a close frame, <code>0x9</code> is a ping, and <code>0xA</code> is a pong. The ping and pong opcodes are how both sides keep the connection alive and detect drops.</p>
      <p>Client to server frames must be masked. This is a spec requirement, not optional. The client generates a 4 byte masking key and XORs each payload byte with the corresponding key byte cyclically. The server must unmask before reading. Server to client frames are never masked.</p>
  
      <h2>Building It in Node With Just Net</h2>
      <p>Node's built-in <code>net</code> module gives you raw TCP. The <code>http</code> module gives you access to the upgrade event. That is all you need.</p>
      <pre><code>import http from "http";
  import crypto from "crypto";
  import { Socket } from "net";
  
  const GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
  
  function generateAcceptKey(clientKey: string): string {
    return crypto
      .createHash("sha1")
      .update(clientKey + GUID)
      .digest("base64");
  }
  
  function unmask(payload: Buffer, mask: Buffer): Buffer {
    const result = Buffer.allocUnsafe(payload.length);
    for (let i = 0; i < payload.length; i++) {
      result[i] = payload[i] ^ mask[i % 4];
    }
    return result;
  }
  
  function parseFrame(buffer: Buffer): { opcode: number; payload: Buffer } | null {
    if (buffer.length < 2) return null;
  
    const opcode = buffer[0] & 0x0f;
    const isMasked = (buffer[1] & 0x80) !== 0;
    let payloadLength = buffer[1] & 0x7f;
    let offset = 2;
  
    if (payloadLength === 126) {
      payloadLength = buffer.readUInt16BE(offset);
      offset += 2;
    } else if (payloadLength === 127) {
      payloadLength = Number(buffer.readBigUInt64BE(offset));
      offset += 8;
    }
  
    const mask = isMasked ? buffer.slice(offset, offset + 4) : null;
    if (isMasked) offset += 4;
  
    const payload = buffer.slice(offset, offset + payloadLength);
    return { opcode, payload: mask ? unmask(payload, mask) : payload };
  }
  
  function buildFrame(data: string): Buffer {
    const payload = Buffer.from(data, "utf8");
    const frame = Buffer.allocUnsafe(2 + payload.length);
    frame[0] = 0x81; // FIN + text opcode
    frame[1] = payload.length;
    payload.copy(frame, 2);
    return frame;
  }
  
  const server = http.createServer();
  
  server.on("upgrade", (req, socket: Socket) => {
    const clientKey = req.headers["sec-websocket-key"] as string;
    const acceptKey = generateAcceptKey(clientKey);
  
    socket.write(
      "HTTP/1.1 101 Switching Protocols\r\n" +
      "Upgrade: websocket\r\n" +
      "Connection: Upgrade\r\n" +
      \`Sec-WebSocket-Accept: \${acceptKey}\r\n\` +
      "\r\n"
    );
  
    socket.on("data", (buffer) => {
      const frame = parseFrame(buffer);
      if (!frame) return;
  
      if (frame.opcode === 0x8) {
        socket.end();
        return;
      }
  
      if (frame.opcode === 0x1) {
        const message = frame.payload.toString("utf8");
        console.log("Received:", message);
        socket.write(buildFrame(\`echo: \${message}\`));
      }
    });
  });
  
  server.listen(8080, () => console.log("Listening on port 8080"));</code></pre>
  
      <h2>What This Does Not Cover</h2>
      <p>This is a single-connection echo server. It does not handle fragmented messages, extensions like permessage-deflate, or broadcasting across multiple sockets. Payload lengths above 125 bytes need extended length handling, and you will want proper close frame negotiation in production. But the core loop, handshake, frame parsing, masking, is all here and it runs with zero dependencies.</p>
  
      <h2>Why Bother?</h2>
      <p>Socket.io is fine. Use it when it makes sense. But knowing what lives underneath means you can debug latency issues, optimize frame sizes, or implement the protocol in any language without reaching for a package. The spec is readable, the math is simple, and the payoff is a genuinely clear mental model of how real-time communication works at the wire level.</p>
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
