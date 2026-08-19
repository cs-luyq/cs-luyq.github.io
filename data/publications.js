/* ==========================================================================
   PUBLICATIONS DATA — edit this file to add/remove/reorder publications.
   The page renders items in the order listed here (put newest first).

   Field reference (per item):
     title    (required) Paper title.
     url      (optional) Link opened when clicking the title.
     authors  (required) Array of author names, in order. Any name matching
                         SITE_AUTHOR below is automatically bolded.
                         Append markers for roles — they render as superscripts
                         with an auto-generated global legend above the cards:
                           "Name*"   → * equal contribution (co-first author)
                           "Name†"   → † corresponding author (Option+T)
                           "Name‡"   → ‡ project lead (Option+Shift+7)
                           "Name*†"  → markers can be combined
     venue    (required) Short venue badge text, e.g. "NeurIPS 2026".
     award    (optional) Extra highlight badge, e.g. "🏆 Oral" or "Best Paper".
     desc     (optional) One-sentence takeaway shown under the authors.
     featured (optional) true → full-width card with a large teaser on top.
                         Use sparingly (1–2 headline papers).
     media    (optional) Teaser visual:
                { type: "image", src: "assets/paper1.png", alt: "..." }
                { type: "video", src: "assets/paper1.mp4" }   // autoplays muted, loops
              alt: accessibility text for IMAGES — read by screen readers,
              shown if the file fails to load, indexed by search engines.
              Describe the figure, e.g. "MoVerse pipeline overview".
              (Videos have no alt attribute in HTML; the field is ignored.)
              Aspect-ratio handling via optional `fit`:
                fit: "cover"   (default) fills the slot, crops edges — photos/renders
                fit: "contain" shows the whole figure with equal padding; the slot
                               sizes itself to the media's natural ratio
              Slot shape via optional `aspect` (COVER mode only, default 16/9):
                aspect: "2/1"  → sets the slot ratio; ignored in contain mode
              Card color: the card auto-derives a mini-theme (background wash,
              venue badge, chips) from the teaser's dominant hue. To override
              the auto-detected color, add e.g. accent: "#0d9488".
              Omit `media` entirely to show a neutral placeholder.
     links    (optional) Object of label → url; rendered as icon chips in the
              given order. Labels are free-form text; these get a matching icon:
                paper / pdf → document    code → angle brackets
                video / demo → play       project → link
                slides → presentation     poster → picture
                dataset → database
              Any other label gets a generic link icon and still works.
     bibtex   (optional) Citation as a template string (backticks allow
              multi-line). Adds a "bibtex" chip that opens an in-page popup
              with the citation and a Copy button — no navigation away.
              Do NOT put bibtex inside `links`; use this field instead.
   ========================================================================== */

// Your name as it appears in author lists (used for bolding).
const SITE_AUTHOR = "Yuqin Lu";

const PUBLICATIONS = [
  {
    title: "MoVerse: Real-Time Video World Modeling with Panoramic Gaussian Scaffold",
    url: "https://orange-3dv-team.github.io/MoVerse/",
    authors: ["Yang Zhou*", "Ziheng Wang*", "Yuqin Lu*", "Haofeng Liu", "Jun Liang", "Shengfeng He", "Jing Li"],
    venue: "Technical Report 2026",
    desc: "Moverse builds a navigable 3D world from a single narrow-field-of-view image and renders interactive video in real time on a single RTX 4090.",
    featured: true,
    media: { type: "video", src: "assets/teasers/moverse_web.mp4?v=2", fit: "contain", aspect: "832/480" },
    links: { paper: "https://arxiv.org/abs/2606.13376", code: "https://github.com/Orange-3DV-Team/MoVerse", project: "https://orange-3dv-team.github.io/MoVerse/" },
    bibtex: `@article{moverse2026,
  title   = {MoVerse: Real-Time Video World Modeling with Panoramic Gaussian Scaffold},
  author  = {Yang Zhou, Ziheng Wang, Yuqin Lu, Haofeng Liu, Jun Liang, Shengfeng He, and Jing Li},
  journal = {arXiv preprint arXiv:2606.13376},
  year    = {2026}
}`,
  },
  {
    title: "Gimbal360: Canonicalizing Planar Diffusion for Spherical Panorama Completion",
    url: "https://orange-3dv-team.github.io/Gimbal360/",
    authors: ["Yuqin Lu", "Haofeng Liu", "Yang Zhou", "Yihua Dai", "Guiqing Li", "Shengfeng He", "Jun Liang"],
    venue: "arXiv 2026",
    desc: "Gimbal360 robustly anchors unposed NFoV images into a canonical viewing space, enabling structurally consistent and seamless 360° panorama generation.",
    featured: true,
    media: { type: "image", src: "assets/teasers/gimbal360.jpg?v=1", alt: "Teaser of Gimbal360", fit: "contain", aspect: "2100/960" },
    links: { paper: "https://arxiv.org/abs/2603.23179", code: "https://github.com/Orange-3DV-Team/Gimbal360/", project: "https://orange-3dv-team.github.io/Gimbal360/" },
    bibtex: `@article{lu2026gimbal360,
  title={Gimbal360: Canonicalizing Planar Diffusion for Spherical Panorama Completion},
  author={Yuqin Lu and Haofeng Liu and Yang Zhou and Yihua Dai and Guiqing Li and Shengfeng He and Jun Liang},
  journal={arXiv preprint arXiv:2603.23179},
  year={2026}
}`,
  },
  {
    title: "Canvas3D: Translating 2D Edits into Implicit Neural Instance Field",
    url: "https://dl.acm.org/doi/10.1145/3804490",
    authors: ["Yuqin Lu", "Yihua Dai", "Yutao Jiang", "Tianyi Xiang", "Chuhua Xian", "Shengfeng He"],
    venue: "I3D 2026",
    desc: "Canvas3D enables precise 3D object manipulation and 3D-aware image synthesis driven entirely through intuitive 2D edits.",
    media: { type: "video", src: "assets/teasers/canvas3d_web.mp4?v=1", fit: "contain", aspect: "853/480" },
    links: { paper: "https://dl.acm.org/doi/10.1145/3804490" },
    bibtex: `@article{lu2026canvas3d,
  title={Canvas3D: Translating 2D Edits into Implicit Neural Instance Field},
  author={Lu, Yuqin and Dai, Yihua and Jiang, Yutao and Xiang, Tianyi and Xian, Chuhua and He, Shengfeng},
  journal={Proceedings of the ACM on Computer Graphics and Interactive Techniques},
  volume={9},
  number={1},
  pages={1--20},
  year={2026},
  publisher={ACM New York, NY, USA}
}`,
  },
  {
    title: "Unfolding 3D Gaussian Splatting via Iterative Gaussian Synopsis",
    url: "https://arxiv.org/abs/2604.11685",
    authors: ["Yuqin Lu", "Yang Zhou", "Yihua Dai", "Guiqing Li", "Shengfeng He"],
    venue: "arXiv 2026",
    desc: "A top-down unfolding scheme to achieve compact, high-fidelity, and progressive 3D Gaussian Splatting for resource-constrained environments.",
    media: { type: "image", src: "assets/teasers/unfoldgs.jpg?v=1", alt: "Teaser of Unfolding 3D Gaussian Splatting", fit: "contain", aspect: "800/480" },
    links: { paper: "https://arxiv.org/abs/2604.11685" },
    bibtex: `@article{lu2026unfolding,
  title={Unfolding 3D Gaussian Splatting via Iterative Gaussian Synopsis},
  author={Yuqin Lu and Yang Zhou and Yihua Dai and Guiqing Li and Shengfeng He},
  journal={arXiv preprint arXiv:2604.11685},
  year={2026}
}`,
  },
  {
    title: "Occlusion-Insensitive Talking Head Video Generation via Facelet Compensation",
    url: "https://ojs.aaai.org/index.php/AAAI/article/view/32277",
    authors: ["Yuhui Deng*", "Yuqin Lu*", "Yangyang Xu", "Yongwei Nie", "Shengfeng He"],
    venue: "AAAI 2025",
    desc: "A talking head generation framework that utilizes a \"facelet semantic bank\" to reconstruct occluded facial features through semantic correlation.",
    media: { type: "image", src: "assets/teasers/talkinghead.jpg?v=1", alt: "Pipeline of talking head video generation via facelet compensation", fit: "contain", aspect: "1188/652" },
    links: { paper: "https://ojs.aaai.org/index.php/AAAI/article/view/32277/34432" },
    bibtex: `@inproceedings{deng2025occlusion,
  title={Occlusion-insensitive talking head video generation via facelet compensation},
  author={Deng, Yuhui and Lu, Yuqin and Xu, Yangyang and Nie, Yongwei and He, Shengfeng},
  booktitle={Proceedings of the AAAI conference on artificial intelligence},
  volume={39},
  number={3},
  pages={2726--2734},
  year={2025}
}`,
  },
  {
    title: "ContX: Scene Context Prediction via Context Bank and Layout Perception",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S0031320325005126",
    authors: ["Jingxin Liang", "Yangyang Xu", "Haorui Song", "Yuqin Lu", "Yuhui Deng", "Yiyi Long", "Yan Huang", "Shengxin Liu", "Jianbo Jiao", "Shengfeng He"],
    venue: "Pattern Recognition 2025",
    desc: "ContX improves scene context prediction by integrating explicit linguistic-contextual priors and multi-modal layout alignment to overcome the limitations of traditional pixel-wise supervision.",
    media: { type: "image", src: "assets/teasers/contx.jpg?v=1", fit: "contain", aspect: "1221/720" },
    links: { paper: "https://ink.library.smu.edu.sg/cgi/viewcontent.cgi?article=11233&context=sis_research", code: "https://github.com/liangjingxin4747/ContX/" },
    bibtex: `@article{liang2025contx,
  title={ContX: Scene context prediction via context bank and layout perception},
  author={Liang, Jingxin and Xu, Yangyang and Song, Haorui and Lu, Yuqin and Deng, Yuhui and Long, Yiyi and Huang, Yan and Liu, Shengxin and Jiao, Jianbo and He, Shengfeng},
  journal={Pattern Recognition},
  volume={168},
  pages={111852},
  year={2025},
  publisher={Elsevier}
}`,
  },
  {
    title: "3D Snapshot: Invertible Embedding of 3D Neural Representations in a Single Image",
    url: "https://www.computer.org/csdl/journal/tp/2024/12/10552101/1XApeY8GoAU",
    authors: ["Yuqin Lu", "Bailin Deng", "Zhixuan Zhong", "Tianle Zhang", "Yuhui Quan", "Hongmin Cai", "Shengfeng He"],
    venue: "TPAMI 2024",
    desc: "3D Snapshot distills a 3D NeRF model into a single, visually plausible image that can be easily inverted back into an interactive 3D scene.",
    media: { type: "video", src: "assets/teasers/3Dsnapshot_web.mp4?v=1", fit: "contain", aspect: "854/480" },
    links: { paper: "https://ink.library.smu.edu.sg/cgi/viewcontent.cgi?article=10765&context=sis_research" },
    bibtex: `@article{lu20243d,
  title={3d snapshot: Invertible embedding of 3d neural representations in a single image},
  author={Lu, Yuqin and Deng, Bailin and Zhong, Zhixuan and Zhang, Tianle and Quan, Yuhui and Cai, Hongmin and He, Shengfeng},
  journal={IEEE transactions on pattern analysis and machine intelligence},
  volume={46},
  number={12},
  pages={11524--11531},
  year={2024},
  publisher={IEEE}
}`,
  },
  {
    title: "Learning Invariant and Uniformly Distributed Feature Space for Multi-View Generation",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S1566253523000192",
    authors: ["Yuqin Lu", "Jiangzhong Cao", "Shengfeng He", "Jiangtao Guo", "Qiliang Zhou", "Qingyun Dai"],
    venue: "Information Fusion 2023",
    desc: "A single-to-multi-view generation framework that improves generalization by enforcing contrastive alignment and uniformity constraints in latent space.",
    media: { type: "image", src: "assets/teasers/augan.jpg?v=1", fit: "contain", aspect: "874/460" },
    links: { paper: "https://www.sciencedirect.com/science/article/abs/pii/S1566253523000192" },
    bibtex: `@article{lu2023learning,
  title={Learning invariant and uniformly distributed feature space for multi-view generation},
  author={Lu, Yuqin and Cao, Jiangzhong and He, Shengfeng and Guo, Jiangtao and Zhou, Qiliang and Dai, Qingyun},
  journal={Information Fusion},
  volume={93},
  pages={383--395},
  year={2023},
  publisher={Elsevier}
}`,
  },
];
