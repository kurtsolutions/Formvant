FORMVANT® – Objects. Reimagined.
Fictional industrial design studio website (HTML5, CSS3, vanilla JavaScript).

OPEN LOCALLY
  Double-click index.html. No build step, no server, no dependencies.
  (A local server such as "python3 -m http.server" works too.)

STRUCTURE
  index.html   Markup and content
  style.css    Design tokens, layout, responsive rules, reduced-motion
  script.js    Navigation, scroll reveal, scroll-controlled video
  assets/
    formvant-intro.mp4             Hero background (autoplay, muted, loop)
    speaker-product-showcase.mp4   ARC ONE, controlled by scroll position

SCROLL-CONTROLLED VIDEO
  - Sticky container inside a tall track (420vh).
  - Scroll progress maps to video.currentTime; updates run in requestAnimationFrame.
  - The video loads only when the section is about 1.5 screens away.
  - The showcase file is encoded with a keyframe every 4 frames and without audio
    so seeking stays smooth. The file name is unchanged.
  - With prefers-reduced-motion the video is not scrubbed; a still frame is shown.

NOTES
  - All projects (ARC ONE, VESSEL, HALO) are self-initiated concept work.
  - hello@formvant.studio is a placeholder. The contact form is visual only.
  - Fonts are system fonts, so the site works offline.
