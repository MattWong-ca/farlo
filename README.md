# Farlo 🛰️

Meet Farlo – your personal onboarding buddy for Farcaster.

YouTube demo: https://youtu.be/a1YpC8bhED0
<br>
Farcaster launch:

Start a call with Farlo to learn about the Farcaster social network, get personalized follow/channel/mini app recommendations, and get intros to new people based on your interests!

NEW: you can also chat with Farlo like you do with ChatGPT!

<img width="1440" alt="Farlo" src="https://github.com/user-attachments/assets/7616ee32-3f2b-4a50-9e24-884c0f5cf4ef" />

<img width="1440" alt="Voice chat share" src="https://github.com/user-attachments/assets/b94117a5-242e-459b-bcfc-5f530e24ec0d" />


# Problem

One of the biggest pain points of this billion dollar crypto social app is the onboarding UX. Even when the founding team themselves did user interviews, they discovered it was hard for new users to get started, know where to post, and find like-minded people.

One solution has been to personally onboard new users one by one, but this is manual and won’t be scalable for bringing the next thousands of users onto the app.

With Farlo, your have a personal onboarding buddy that lives right inside Farcaster as a mini app. As a voice AI agent, it's live 24/7, capable of guiding the next thousands of users to make their first cast, find the right channels, and get intros to new people! Farlo also keeps a record of your previous calls, so it remembers you :)

<img width="1440" alt="Screenshots" src="https://github.com/user-attachments/assets/8af6bb1d-8d2c-47fd-96fc-15a220a647c6" />
<img width="1440" alt="Screenshot" src="https://github.com/user-attachments/assets/d3b9cca6-6bc7-40bb-a84a-6ae67567194b" />

# Roadmap

Going forward, Farlo will evolve into the Boardy AI of Farcaster. 

Imagine you can talk to someone who knows everyone and everything happening on the app. Whether it’s moving to a new city, career questions, or because of similar interests, social discovery is now 1 quick call away.

And unlike gated APIs by web2 social apps which make it difficult to build on top of, Farcaster is programmable, so the public user data + APIs lead to deeper + more meaningful connections. Farcaster also has primitives like mini apps, extensions, and a built-in crypto wallet, which makes it the perfect environment for social viral loops + growth experiments.

<img width="1440" alt="Roadmap" src="https://github.com/user-attachments/assets/3b61f978-59bb-42ca-9656-63021ee03f8a" />

# Techstack

**Vapi**: voice AI agent
- The primary product, Farlo, is a Vapi assistant. I included overrides based on whether it was a new user (Farlo will have context of your previous calls if you've met before!)
- Tools: built a tool to help Farlo fetch live data of the most popular mini apps using the Neynar API
- **Chat**: implemented the newly-released Chat feature so users can also chat with Boardy if they'd like

**Supabase**: storing users + calls
- Supabase tables used to keep a record of all the users who've met Farlo before, as well as a summary of their calls
- This will be important for making introductions based on the info we have about them
- If you've met Farlo already, we use a Vapi override so we can fetch the previous call summaries and give them to Farlo for context

**Farcaster**: mini app + messaging
- Frontend was built using Coinbase's MiniKit template for mini apps
- Direct Cast API used for auto-DMing users after their call
