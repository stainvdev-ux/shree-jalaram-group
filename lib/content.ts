// All copy below is taken from shreejalaramgroup.com (home, about, news and
// venture detail pages). Short taglines are condensed from each venture's text.

export const group = {
  name: "Shree Jalaram Group",
  since: 1977,
  hq: "Mumbai",
  address: "101, Bhakti Park, RHB Road, Mulund (West), Mumbai-400080.",
  phone: "1800 2 669 669",
  phoneHref: "tel:18002669669",
  email: "info@shreejalaramgroup.com",
  map: "https://www.google.com/maps?cid=7453991512386283693",
  facebook: "https://www.facebook.com/shreejalaramgroup",
  about: [
    "Headquartered in Mumbai, Shree Jalaram Group is a dynamic and diversified business conglomerate with a strong and growing presence across multiple industries. Built on a foundation of entrepreneurial vision and operational excellence, the Group has successfully established itself in a wide range of sectors, including online lottery terminals, sports betting, real estate development and management, healthcare services, apparel and fashion, food and beverages, software development, IT solutions, casino operations, online and electronic gaming centres with hotel operations.",
    "With a robust network of subsidiaries and strategic partnerships, Shree Jalaram Group operates at scale while maintaining agility and innovation across its businesses. Our ventures are driven by a deep understanding of market dynamics, enabling us to deliver high quality products, services, and experiences tailored to evolving customer needs. From technology driven platforms to customer centric hospitality and entertainment offerings, each vertical reflects our commitment to excellence and long term value creation.",
    "Backed by a workforce of over 10,000 dedicated professionals, the Group continues to expand its footprint while upholding strong governance, integrity, and performance standards. Our consistent growth trajectory is a result of our focus on innovation, strategic investments, and customer satisfaction. As we move forward, Shree Jalaram Group remains committed to setting new benchmarks across industries and creating sustainable impact through responsible and forward looking business practices.",
  ],
  vision:
    "To be a leading diversified business group recognized for innovation, integrity, and excellence across industries, while creating sustainable value for customers, partners, and communities. We aspire to expand our global footprint and set new benchmarks in technology driven solutions, entertainment, and service oriented businesses.",
  mission:
    "Our mission is to deliver high quality products, services, and experiences across all our business verticals by combining innovation, operational efficiency, and customer centric thinking. We aim to continuously evolve with changing market dynamics, invest in future ready technologies, and foster long term relationships built on trust and performance.",
  values: [
    { title: "Integrity", text: "We conduct our business with transparency, honesty, and strong ethical principles, ensuring trust in every relationship." },
    { title: "Customer First", text: "Our customers are at the heart of everything we do. We strive to exceed expectations through quality, service, and innovation." },
    { title: "Excellence", text: "We are committed to achieving the highest standards in every aspect of our operations, driving consistent performance and growth." },
    { title: "Innovation", text: "We embrace change and encourage new ideas, leveraging technology and creativity to stay ahead in a competitive landscape." },
    { title: "Collaboration", text: "We believe in the power of teamwork within our organization and with our partners to achieve shared success." },
    { title: "Responsibility", text: "We are committed to sustainable and responsible business practices that positively impact society and the environment." },
  ],
  sectors: [
    "Online Lottery Terminals",
    "Sports Betting",
    "Real Estate",
    "Healthcare",
    "Apparel & Fashion",
    "Food & Beverages",
    "Software Development",
    "IT Solutions",
    "Casino Operations",
    "Gaming Centres",
    "Hotel Operations",
  ],
  stats: [
    { value: 1977, suffix: "", label: "Legacy since" },
    { value: 10000, suffix: "+", label: "Dedicated professionals" },
    { value: 13, suffix: "", label: "Ventures under one group" },
    { value: 11, suffix: "", label: "Industries served" },
  ],
};

export type Venture = {
  slug: string;
  name: string;
  sector: string;
  location: string;
  tagline: string;
  body: string[];
  stats?: { value: string; label: string }[];
  website?: string;
  socials: { label: "Facebook" | "Instagram" | "YouTube"; href: string }[];
  accent: string;
  shape: number;
};

export const ventures: Venture[] = [
  {
    slug: "golden-lotto",
    name: "Golden Lotto",
    sector: "Lottery",
    location: "Mumbai · Maharashtra, Goa & the North East",
    tagline: "India's lottery pioneer, blending trust, technology and a touch of luck since 1977.",
    body: [
      "Welcome to Golden Lotto where fortune meets excitement. Since 1977, Golden Lotto has been at the forefront of India's lottery industry, committed to making the lottery experience engaging, transparent, and accessible to players across the country. Headquartered in Mumbai, Golden Lotto is a licensed, government approved organization operating legally across multiple Indian states. Over the decades, we have evolved into a pioneering force by offering both traditional paper lotteries and modern online platforms ensuring greater convenience, wider reach, and an enhanced player experience.",
      "As the creators of the renowned Golden Online Lottery Terminal, we have introduced innovation that has transformed the way lotteries are experienced in India. Our products, offered under the trusted “Golden” brand, are widely available across Maharashtra, Goa, and the North East featuring some of the country's most rewarding jackpots and entertainment driven formats. Golden Lotto serves as an authorized distributor and super stockist for government lotteries, working with states such as Mizoram, Arunachal Pradesh, Meghalaya, and Maharashtra. We have also held exclusive rights to distribute lotteries for regions including Bhutan, Nagaland, Goa, Sikkim, and Mizoram contributing significantly to state revenues while adhering strictly to India's Lottery Rules and Regulations.",
      "Beyond lotteries, Golden Lotto has expanded its footprint across complementary sectors including sports engagement, skill-based gaming, and casino experiences building a diverse and dynamic portfolio that reflects our commitment to innovation and growth. At Golden Lotto, we continue to blend trust, technology, and excitement bringing opportunity, entertainment, and a touch of luck to millions across India.",
    ],
    stats: [
      { value: "1977", label: "Pioneering since" },
      { value: "4", label: "States served as distributor & super stockist" },
      { value: "Paper + Online", label: "Lottery formats" },
    ],
    website: "https://www.mygoldenlotto.com/",
    socials: [
      { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61568878894140" },
      { label: "Instagram", href: "https://www.instagram.com/mygoldenlotto" },
      { label: "YouTube", href: "https://www.youtube.com/@GoldenLottery" },
    ],
    accent: "#8a63e0",
    shape: 6,
  },
  {
    slug: "casino-golden",
    name: "Casino Golden",
    sector: "Casino",
    location: "Sikkim · Nepal · Goa",
    tagline: "The largest gaming destination in Sikkim, set within Ramada by Wyndham.",
    body: [
      "Welcome to Casino Golden, a premier gaming destination with an established presence across Sikkim, Nepal, and Goa. Located within Ramada by Wyndham, Sikkim, Casino Golden offers an elevated and immersive experience that blends world-class gaming with refined hospitality. Whether you are visiting for business or leisure, the casino provides an engaging and vibrant atmosphere designed to enhance every stay.",
      "Spanning an expansive 15,000 sq. ft., Casino Golden features 32 live gaming tables along with state of the art gaming machines, thoughtfully spread across two luxurious gaming floors. As the largest gaming destination in Sikkim, it delivers a dynamic mix of classic table games, modern gaming technology, and premium service standards. Guests can enjoy a seamless combination of entertainment, comfort, and exclusivity, making it a must visit attraction in the region.",
      "Backed by over six years of business excellence, Shivaay Gaming International Private Limited brings deep expertise across hospitality, beverages, and healthcare. Its foray into the casino industry reflects a strong commitment to raising gaming standards and delivering exceptional experiences. At Casino Golden, guests can expect a perfect blend of luxury, innovation, and service setting a new benchmark for gaming in Sikkim.",
    ],
    stats: [
      { value: "15,000", label: "Sq. ft. of gaming" },
      { value: "32", label: "Live gaming tables" },
      { value: "2", label: "Luxurious gaming floors" },
    ],
    website: "https://casinogolden.in/",
    socials: [
      { label: "Facebook", href: "https://www.facebook.com/casinogoldengangtok" },
      { label: "Instagram", href: "https://www.instagram.com/casinogoldengangtok/" },
    ],
    accent: "#f2b53a",
    shape: 5,
  },
  {
    slug: "golden-gaming",
    name: "Golden Gaming Sikkim",
    sector: "Gaming & Entertainment",
    location: "Gangtok · Jorethang · Namchi · Singtam",
    tagline: "Vibrant gaming floors and warm hospitality across four Sikkim destinations.",
    body: [
      "Golden Gaming Sikkim invites you into a world of vibrant entertainment, refined hospitality, and immersive gaming experiences. From the moment you arrive, you are welcomed into an atmosphere that blends lively energy with effortless comfort designed to make every visit memorable. With a presence across Gangtok, Jorethang, Namchi, and Singtam, each of our centers is thoughtfully curated to deliver a consistent yet distinctive experience.",
      "Whether you’re seeking excitement or relaxation, every location reflects our commitment to quality, ambiance, and guest satisfaction. At the heart of Golden Gaming Sikkim is our dedication to warm and attentive service. Our team combines professionalism with genuine hospitality, ensuring every guest feels valued and well taken care of.",
      "Our gaming floors offer a dynamic mix of entertainment, featuring Spintec gaming, live Roulette, Baccarat, Blackjack, engaging slot machines, and immersive sports betting experiences. Complementing the experience is our stylish bar, where expertly crafted beverages meet a vibrant and inviting setting. At Golden Gaming Sikkim, we bring together entertainment, hospitality, and atmosphere to create moments that are exciting, effortless, and truly unforgettable.",
    ],
    stats: [
      { value: "4", label: "Gaming centres across Sikkim" },
      { value: "6", label: "Gaming formats, from Roulette to sports betting" },
    ],
    website: "https://goldengaming.in",
    socials: [
      { label: "Facebook", href: "https://www.facebook.com/goldengamingsikkim/" },
      { label: "Instagram", href: "https://www.instagram.com/goldengamingsikkim" },
    ],
    accent: "#d9a94e",
    shape: 7,
  },
  {
    slug: "ramada-gangtok",
    name: "Ramada by Wyndham Gangtok",
    sector: "Hospitality",
    location: "Gangtok, Sikkim",
    tagline: "56 rooms of refined hospitality, dining and wellness in the heart of Gangtok.",
    body: [
      "Check in, unwind, and experience a stay defined by comfort, style, and thoughtful hospitality. Located in the heart of Gangtok, our hotel offers the perfect balance between vibrant city access and peaceful retreat placing you just moments away from all the excitement the city has to offer. With 56 well appointed rooms, guests can choose from a variety of configurations tailored to their preferences. Each room is designed with premium amenities and modern features to ensure a relaxing and seamless stay.",
      "From the moment you arrive, our grand lobby sets the tone welcoming you into a space that reflects elegance, warmth, and refined luxury. Indulge in a diverse culinary journey at The Trinity Restaurant & Bar, where multi cuisine buffet spreads and à la carte selections cater to every palate. Complemented by an all day coffee shop and 24/7 room service, dining here is designed for both convenience and delight. For those seeking relaxation and rejuvenation, enjoy a fully equipped gym, expert spa therapies, or a refreshing dip in the heated rooftop pool.",
      "Whether hosting celebrations, corporate meetings, or special events, our versatile conference spaces are designed to adapt to your needs. Adding to the excitement, guests can explore one of India's most expansive gaming destinations at Casino Golden, located within Ramada by Wyndham. From luxurious stays to exceptional dining, wellness, events, and entertainment, every aspect of your visit is thoughtfully curated to create a memorable and enriching experience.",
    ],
    stats: [
      { value: "56", label: "Well appointed rooms" },
      { value: "24/7", label: "Room service" },
      { value: "Rooftop", label: "Heated pool" },
    ],
    website: "https://www.wyndhamhotels.com/ramada/gangtok-india/ramada-by-wyndham-gangtok-hotel-casino-golden/overview",
    socials: [
      { label: "Facebook", href: "https://www.facebook.com/ramadagangtok" },
      { label: "Instagram", href: "https://www.instagram.com/ramadagangtok" },
    ],
    accent: "#e2414a",
    shape: 3,
  },
  {
    slug: "cloud9-beverages",
    name: "Cloud9 Beverages",
    sector: "Food & Beverages",
    location: "Pan India",
    tagline: "One of India's most recognised and fastest growing energy drink brands.",
    body: [
      "Cloud9 Beverages stands as one of India's most recognized and rapidly growing energy drink brands, known for redefining refreshment through innovation, quality, and bold product offerings. As a pioneer in the segment, the brand offers an extensive portfolio of energy drinks, carbonated beverages, and fresh fruit-based drinks crafted to deliver both taste and performance.",
      "With a strong foundation built on advanced technology and deep market expertise, Cloud9 has consistently distinguished itself in a highly competitive landscape. Today, its products are widely available across the country, with a presence in over 30,000 retail outlets and 5,000 liquor stores, as well as in some of India's most premium hotels, restaurants, and pubs. Every Cloud9 beverage is produced under stringent quality and hygiene standards, ensuring safety, consistency, and a superior drinking experience in every sip.",
      "Driven by innovation, world-class production practices, and strong brand identity, Cloud9 continues to earn recognition and customer loyalty. Notably, the brand was honored with the Frost & Sullivan Product Excellence Award (2011) in the Indian energy drinks category further reinforcing its position as a benchmark in the industry. At Cloud9, the philosophy is simple: deliver the finest beverages that energize, refresh, and elevate everyday moments.",
    ],
    stats: [
      { value: "30,000+", label: "Retail outlets" },
      { value: "5,000", label: "Liquor stores" },
      { value: "2011", label: "Frost & Sullivan Product Excellence Award" },
    ],
    website: "https://www.cloud9beverages.com/",
    socials: [
      { label: "Facebook", href: "https://www.facebook.com/Cloud9Beverages/" },
      { label: "Instagram", href: "https://www.instagram.com/cloud9beverages/" },
    ],
    accent: "#3f6df0",
    shape: 8,
  },
  {
    slug: "colab-company",
    name: "Colab Company",
    sector: "Architecture & Interiors",
    location: "Mumbai",
    tagline: "A global-minded design collective with over 90 projects delivered.",
    body: [
      "We are an extroverted collective of design enthusiasts with a distinctly global perspective, driven by a passion for exploring and expressing creativity across every dimension of design. From homes and restaurants to bespoke furniture, everyday products, large scale commercial spaces, and curated exhibitions, our work reflects a seamless blend of imagination, functionality, and artistic vision.",
      "Guided by a scenographic approach to spatial design, we specialize in crafting refined residential, hospitality, and commercial environments of every scale. Our expertise lies in creating spaces that are not only visually striking but also immersive, dynamic, and thoughtfully aligned with contemporary lifestyles.",
      "With nearly a decade of experience and a cohesive team of highly skilled professionals, we have successfully delivered over 90 projects under Colab Company. Each project is a testament to our collaborative spirit, attention to detail, and commitment to design excellence. At our core, we believe design is not just about aesthetics it's about creating experiences that inspire, engage, and endure.",
    ],
    stats: [
      { value: "90+", label: "Projects delivered" },
      { value: "~10", label: "Years of design practice" },
    ],
    website: "https://www.colab-co.com/",
    socials: [
      { label: "Facebook", href: "https://www.facebook.com/ColabCompany/" },
      { label: "Instagram", href: "https://www.instagram.com/colab.co/" },
      { label: "YouTube", href: "https://www.youtube.com/@ColabCompany/featured" },
    ],
    accent: "#2f78ff",
    shape: 2,
  },
  {
    slug: "one-o-one-studios",
    name: "One O One Studios",
    sector: "Furniture & Product Design",
    location: "Mumbai",
    tagline: "Statement furniture, made in India, designed to evoke a sense of wonder.",
    body: [
      "One O One is a contemporary furniture and product design studio redefining the way spaces come to life. Rooted in creativity and driven by a passion for innovation, we craft statement pieces that transform ordinary environments into extraordinary experiences. Inspired by global design revolutionaries yet deeply grounded in Indian craftsmanship, One O One moves beyond standardised, mass market aesthetics.",
      "Founded by Yasha Mehta and Hiren Ganatra, One O One is the culmination of vision, expertise, and a shared commitment to pushing creative boundaries. Yasha, a design professional trained at Parsons School of Design, New York, brings a refined global perspective, while Hiren, a seasoned entrepreneur and the force behind Colab Company, contributes strategic insight and deep industry experience.",
      "At the heart of One O One lies a deep appreciation for craftsmanship. Every piece is thoughtfully brought to life by skilled Indian artisans who infuse passion, precision, and authenticity into their work. At One O One, we don't just design furniture we create experiences, inspire spaces, and bring stories to life through design.",
    ],
    website: "https://oneoonestudios.com/",
    socials: [
      { label: "Facebook", href: "https://www.facebook.com/profile.php?id=100089031048573" },
      { label: "Instagram", href: "https://www.instagram.com/oneoonestudios/" },
    ],
    accent: "#c9b38c",
    shape: 12,
  },
  {
    slug: "jalaram-jyoti",
    name: "Jalaram Jyoti",
    sector: "Construction & Real Estate",
    location: "Mumbai",
    tagline: "Residential, commercial and industrial projects built to stand the test of time.",
    body: [
      "Jalaram Jyoti is a trusted construction company based in Mumbai, recognized for delivering high quality residential, commercial, and industrial projects. With a strong legacy of experience and a commitment to excellence, we have built a reputation for reliability, precision, and customer satisfaction.",
      "Our team of skilled professionals brings together technical expertise, innovative thinking, and a deep understanding of modern construction practices. Our comprehensive range of services includes project management, design and build solutions, and end to end construction execution, ensuring every project is delivered on time and within budget.",
      "At Jalaram Jyoti, we go beyond building structures we build lasting relationships and thriving communities. Every project we undertake reflects our dedication to superior craftsmanship and our vision of shaping environments that stand the test of time. With Jalaram Jyoti, you gain a construction partner committed to turning ideas into enduring landmarks.",
    ],
    stats: [{ value: "3", label: "Segments: residential, commercial & industrial" }],
    socials: [],
    accent: "#f08a2c",
    shape: 9,
  },
  {
    slug: "gold-roll",
    name: "Gold Roll",
    sector: "Thermal Paper Manufacturing",
    location: "India",
    tagline: "Among India's leading and fastest growing thermal paper manufacturers.",
    body: [
      "Gold Roll is a trusted name in the thermal paper manufacturing industry and stands among India's leading and fastest growing companies in this segment. With a strong presence in the domestic market, we have earned a reputation as a reliable supplier known for consistent quality, dependable service, and customer centric operations.",
      "Our journey reflects the evolution of technology itself from the early days of cash registers to today's advanced retail systems, ATMs, and IT-enabled solutions. We continuously adapt and innovate to align with these advancements, ensuring our products remain relevant, efficient, and future ready.",
      "At the core of Gold Roll lies a simple yet powerful mission: to use innovative technology thoughtfully to solve our customers' needs. With a focus on reliability, innovation, and performance, Gold Roll continues to set benchmarks in thermal paper manufacturing supporting businesses with solutions they can trust.",
    ],
    website: "http://www.goldroll.in/index.html",
    socials: [
      { label: "Facebook", href: "https://www.facebook.com/people/GOLD-ROLL/100089456930286/" },
      { label: "Instagram", href: "https://www.instagram.com/goldroll.in/" },
    ],
    accent: "#d8b45a",
    shape: 10,
  },
  {
    slug: "golden-digitech",
    name: "Golden Digitech",
    sector: "Technology",
    location: "Mumbai",
    tagline: "Digital transformation, from cloud and data to automation, AI and UX.",
    body: [
      "Golden Digitech is a forward thinking technology company committed to delivering seamless, high quality digital solutions that empower businesses to achieve stronger returns on their existing investments. By combining innovation with deep technical expertise, we help industry leaders navigate complex challenges and unlock new opportunities in an increasingly digital world.",
      "Our team of experienced technologists and problem solvers excels at transforming intricate business requirements into efficient, scalable, and user friendly solutions. We enable organizations to embrace a future ready mindset by integrating advanced technologies into their core operations. From cloud computing and data analytics to automation, artificial intelligence, big data, and UX research, our solutions are designed to be both highly functional and exceptionally responsive.",
      "Having collaborated with businesses across diverse industries and domains, we bring a broad perspective and proven capability to every project. With a commitment to innovation, reliability, and continuous evolution, Golden Digitech stands as a trusted partner in shaping powerful digital experiences for modern enterprises.",
    ],
    socials: [{ label: "Instagram", href: "https://www.instagram.com/golden.digitech/" }],
    accent: "#2e9bf0",
    shape: 11,
  },
  {
    slug: "moto-freaks",
    name: "Moto Freaks",
    sector: "Automotive",
    location: "Mulund, Mumbai",
    tagline: "A premium one-stop destination for performance, accessories and car care.",
    body: [
      "Based in Mumbai (Mulund), Moto Freaks is a premium automotive solutions provider dedicated to delivering a seamless, end to end experience for car enthusiasts and owners across India. Built on a passion for performance and precision, we bring together the finest products and services under one roof creating a true one stop destination for everything your car needs.",
      "Our expertise spans performance enhancements, high quality accessories, general repairs, and professional paintwork. Every service we offer is executed through a network of carefully selected channel partners industry leaders known for their craftsmanship, reliability, and technical excellence.",
      "Moto Freaks is more than just an automotive service provider we are a team of passionate specialists driven by innovation, quality, and a deep understanding of automotive culture. Whether you're looking to elevate your vehicle's performance, enhance its appearance, or ensure it runs at its best, Moto Freaks stands as your trusted partner in automotive excellence.",
    ],
    website: "https://motofreaks.co/",
    socials: [
      { label: "Facebook", href: "https://www.facebook.com/motofreaks.co/" },
      { label: "Instagram", href: "https://www.instagram.com/motofreaks.co/" },
    ],
    accent: "#ef4b3f",
    shape: 1,
  },
  {
    slug: "naukree-dukan",
    name: "Naukree Dukan",
    sector: "Employment",
    location: "Mumbai",
    tagline: "Connecting job seekers with meaningful work, and businesses with the right talent.",
    body: [
      "Headquartered in Mumbai, Naukree Dukan is a dynamic platform under the Dukaaan Group, driven by a vision to redefine employment accessibility across diverse sectors. With a forward thinking approach and a commitment to challenging the status quo, we continue to explore new opportunities and expand into emerging domains.",
      "At our core, we are dedicated to building a brand that is inclusive, reliable, and impactful connecting job seekers with meaningful employment opportunities while supporting businesses in finding the right talent. Currently focused on the Mumbai market, Naukree Dukan has established itself as a trusted platform for employment across multiple industries.",
      "As we continue to grow, our ambition is to expand our reach across India, creating a nationwide network that empowers individuals and organizations alike. With a mission to bridge the gap between opportunity and talent, Naukree Dukan is committed to shaping the future of employment making it more accessible, efficient, and inclusive for all.",
    ],
    website: "https://naukreedukan.com",
    socials: [
      { label: "Facebook", href: "https://www.facebook.com/profile.php?id=100089680646137" },
      { label: "Instagram", href: "https://www.instagram.com/naukreedukan/" },
    ],
    accent: "#4d7ff0",
    shape: 4,
  },
  {
    slug: "narmadaben-foundation",
    name: "Narmadaben Foundation",
    sector: "CSR & Philanthropy",
    location: "India",
    tagline: "The Group's platform for community development, social welfare and inclusive growth.",
    body: [
      "At Shree Jalaram Group, we believe that corporate social responsibility and sustainability go hand in hand. Our commitment extends beyond business success to creating a positive and lasting impact on society and the environment. We strive to operate in a manner that is economically sound, socially responsible, and environmentally sustainable while maintaining the highest standards of transparency and ethical conduct in all our interactions.",
      "Our CSR initiatives are driven through the Narmadaben Foundation, which serves as the central platform for planning and executing social impact programs across the Group. Through this initiative, we actively contribute to community development, social welfare, and inclusive growth.",
      "We are also proud to collaborate with the Akshaya Patra Foundation, supporting their mission to provide hygienic and nutritious midday meals to children from underprivileged backgrounds. At Shree Jalaram Group, we remain committed to building not just successful enterprises, but a more equitable and sustainable future for all.",
    ],
    socials: [],
    accent: "#e0b54a",
    shape: 13,
  },
];

export const news = [
  { year: 2025, title: "This 2,200-square-foot home in Powai is a sculptural retreat of quiet sophistication", venture: "Colab Company" },
  { year: 2024, title: "An ashram in the maximum city, Colab Company creates an all-white holiday home in Mumbai", venture: "Colab Company" },
  { year: 2024, title: "Orangutan Gaming partners with Cloud9 Energy Drink as its ‘Exclusive Energy Drink Partner’", venture: "Cloud9 Beverages" },
  { year: 2024, title: "Mumbai City Announce Cloud 9 As Energy Drink Partner", venture: "Cloud9 Beverages" },
  { year: 2023, title: "Cloud9 Beverages: Driven with Vision to Serve Only the Best & Highest-Quality Drink", venture: "Cloud9 Beverages" },
  { year: 2022, title: "Ramada by Wyndham Hotel & Golden Casino opens in Gangtok", venture: "Ramada by Wyndham Gangtok" },
  { year: 2021, title: "Golden Gaming International launches Casino Golden in Goa", venture: "Casino Golden" },
  { year: 2016, title: "First 'online sports betting' centre attracts tourists in Sikkim", venture: "Golden Gaming Sikkim" },
  { year: 2015, title: "Sikkim clears way for India's first betting shops but its ambitions have been curtailed", venture: "Golden Gaming Sikkim" },
  { year: 2008, title: "Shilpa launches Cloud9", venture: "Cloud9 Beverages" },
];

export const nav = [
  { href: "/about", label: "About" },
  { href: "/ventures", label: "Ventures" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];

// Images are served from the group's existing site, where they are already hosted.
export const ASSET_HOST = "https://shreejalaramgroup.com";
const media: Record<string, [photoId: string, logoId: string]> = {
  "golden-lotto": ["1771254832", "1772806203"],
  "casino-golden": ["1772804978", "1771779435"],
  "golden-gaming": ["1770046720", "1771779444"],
  "ramada-gangtok": ["1770293937", "1771779540"],
  "cloud9-beverages": ["1770466854", "1771779609"],
  "colab-company": ["1772806802", "1771779486"],
  "one-o-one-studios": ["1770389085", "1771779589"],
  "jalaram-jyoti": ["1770227480", "1771779511"],
  "gold-roll": ["1772807198", "1771779522"],
  "golden-digitech": ["1770292717", "1771779530"],
  "moto-freaks": ["1770389941", "1771779599"],
  "naukree-dukan": ["1770385122", "1771779564"],
  "narmadaben-foundation": ["1770295361", "1771779552"],
};
export const photo = (slug: string) => `${ASSET_HOST}/admin/uploads/${media[slug][0]}company.webp`;
export const logo = (slug: string) => `${ASSET_HOST}/admin/uploads/company_logo/${media[slug][1]}_logo.png`;
export const groupLogo = `${ASSET_HOST}/assets/img/logo.webp`;
export const getVenture = (slug: string) => ventures.find((v) => v.slug === slug);
