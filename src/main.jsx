import { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowDown, ArrowLeft, ArrowUpRight, BookMarked, BookOpen, Bookmark, Calculator,
  CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, Compass, HeartHandshake,
  Landmark, Mail, MapPin, Menu, Minus, Moon, Navigation, Phone, Play, Plus,
  Quote, RotateCcw, Search, Sparkles, Sun, X,
} from 'lucide-react'
import './styles.css'
import './hero-layout-fix.css'

const prayerByCity = {
  Lahore: { label: 'Lahore, Pakistan', prayers: [['Fajr', '04:28'], ['Sunrise', '05:48'], ['Dhuhr', '12:09'], ['Asr', '16:38'], ['Maghrib', '18:30'], ['Isha', '19:50']], qibla: 262 },
  Karachi: { label: 'Karachi, Pakistan', prayers: [['Fajr', '04:53'], ['Sunrise', '06:12'], ['Dhuhr', '12:39'], ['Asr', '17:05'], ['Maghrib', '18:57'], ['Isha', '20:17']], qibla: 258 },
  Islamabad: { label: 'Islamabad, Pakistan', prayers: [['Fajr', '04:20'], ['Sunrise', '05:43'], ['Dhuhr', '12:05'], ['Asr', '16:34'], ['Maghrib', '18:26'], ['Isha', '19:48']], qibla: 260 },
}

const hijriMonths = ['Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaban', 'Ramadan', 'Shawwal', 'Dhul Qadah', 'Dhul Hijjah']

const hadiths = [
  {
    text: 'Actions are judged by intentions, and every person will be rewarded according to their intention.',
    source: 'Sahih al-Bukhari, Hadith 1',
    topic: 'The light of intention',
  },
  {
    text: 'Whoever does not show mercy will not be shown mercy.',
    source: 'Sahih al-Bukhari, Hadith 7376',
    topic: 'The path of mercy',
  },
  {
    text: 'The best among you are those who learn the Quran and teach it.',
    source: 'Sahih al-Bukhari, Hadith 5027',
    topic: 'A bond with the Quran',
  },
]

const knowledgeCards = [
  ['Quran', 'A daily connection with revelation', BookOpen],
  ['Hadith', 'Guidance from the Prophetic tradition', Quote],
  ['Seerah', 'The life of the Prophet Muhammad', Sparkles],
  ['Fiqh', 'Islamic principles for everyday life', Landmark],
  ['Islamic History', 'The enduring story of the Ummah', CalendarDays],
  ['Daily Remembrance', 'Remembering Allah in every moment', Moon],
  ['Duas', 'A conversation from the heart to the Creator', HeartHandshake],
  ['Prayer', 'The still point of the day', Clock3],
  ['Fasting', 'A journey toward mindfulness', Sun],
  ['Zakat', 'Purifying what we hold', HeartHandshake],
  ['Hajj & Umrah', 'Answering the sacred call', Navigation],
]

const courses = [
  ['Quran Reading', 'Read the Quran with confidence, clarity and care.', '6 months', 'Beginner'],
  ['Quran Memorisation', 'A guided program with daily revision and character building.', '2–3 years', 'Intermediate'],
  ['Tajweed', 'Strengthen your recitation through focused practical study.', '4 months', 'All levels'],
  ['Quran Translation', 'Build a direct understanding of the Quran’s message.', '8 months', 'Intermediate'],
  ['Tafsir', 'Explore selected surahs through reflective and practical study.', '12 months', 'Advanced'],
  ['Hadith Studies', 'Build your life around selected Prophetic teachings.', '6 months', 'Intermediate'],
]

const azkar = [
  ['Morning remembrance', 'Begin the morning in the awareness that all sovereignty belongs to Allah.', 'A quiet intention for a grateful, purposeful day.'],
  ['Evening remembrance', 'End the day by returning its cares and its blessings to Allah.', 'A simple pause for gratitude and reflection.'],
  ['Before sleep', 'In Your name, O Allah, I live and I die.', 'A prayer of trust before rest.'],
  ['After prayer', 'I seek forgiveness from Allah.', 'A moment of humility after every prayer.'],
  ['Travel dua', 'Glory to the One who has made this journey possible for us.', 'A prayer of safety and gratitude while travelling.'],
  ['Before eating', 'In the name of Allah and with His blessing.', 'A mindful beginning to every meal.'],
]

const quranSurahs = [
  { n: '01', name: 'Al-Fatihah', en: 'The Opening', ayah: '1–7' },
  { n: '02', name: 'Al-Baqarah', en: 'The Cow', ayah: '1–286' },
  { n: '36', name: 'Ya-Sin', en: 'Ya-Sin', ayah: '1–83' },
  { n: '55', name: 'Ar-Rahman', en: 'The Most Merciful', ayah: '1–78' },
  { n: '67', name: 'Al-Mulk', en: 'The Dominion', ayah: '1–30' },
  { n: '112', name: 'Al-Ikhlas', en: 'Sincerity', ayah: '1–4' },
]

const reveal = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0, transition: { duration: .72, ease: [0.22, 1, 0.36, 1] } },
}

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function useClock(prayers) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  const result = useMemo(() => {
    const minuteNow = now.getHours() * 60 + now.getMinutes()
    const values = prayers.map(([name, time], idx) => {
      const [h, m] = time.split(':').map(Number)
      return { name, time, minutes: h * 60 + m, idx }
    })
    let upcoming = values.find((prayer) => prayer.minutes > minuteNow)
    let tomorrow = false
    if (!upcoming) { upcoming = values[0]; tomorrow = true }
    const target = new Date(now)
    target.setHours(Math.floor(upcoming.minutes / 60), upcoming.minutes % 60, 0, 0)
    if (tomorrow) target.setDate(target.getDate() + 1)
    const seconds = Math.max(0, Math.floor((target - now) / 1000))
    return { upcoming, countdown: [Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60), seconds % 60].map(n => String(n).padStart(2, '0')).join(':') }
  }, [now, prayers])
  return result
}

function getDateInfo() {
  const date = new Date()
  const gregorian = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
  const hijriParts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).formatToParts(date)
  const value = type => hijriParts.find(part => part.type === type)?.value || ''
  const monthEn = value('month')
  const lookup = { Muharram: 'Muharram', Safar: 'Safar', 'Rabiʻ I': 'Rabi al-Awwal', 'Rabiʻ II': 'Rabi al-Thani', 'Jumada I': 'Jumada al-Awwal', 'Jumada II': 'Jumada al-Thani', Rajab: 'Rajab', Shaʻban: 'Shaban', Ramadan: 'Ramadan', Shawwal: 'Shawwal', 'Dhuʻl-Qiʻdah': 'Dhul Qadah', 'Dhuʻl-Hijjah': 'Dhul Hijjah' }
  const currentMonth = lookup[monthEn] || 'Safar'
  return { gregorian, hijri: `${value('day')} ${currentMonth} ${value('year')} AH`, currentMonth }
}

function SectionIntro({ eyebrow, title, text, align = 'start', light = false }) {
  return <motion.div className={`section-intro ${align} ${light ? 'light' : ''}`} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: .3 }}>
    <p className="eyebrow"><span />{eyebrow}</p>
    <h2>{title}</h2>
    {text && <p className="intro-copy">{text}</p>}
  </motion.div>
}

function Button({ children, variant = 'gold', onClick, type = 'button', className = '' }) {
  return <button type={type} className={`button ${variant} ${className}`} onClick={onClick}>{children}<ArrowLeft size={17} strokeWidth={1.8} /></button>
}

function GeometricMark({ small = false }) {
  return <div className={`geometric-mark ${small ? 'small' : ''}`} aria-hidden="true"><i /><i /><i /><i /><b /></div>
}

function Header() {
  const [open, setOpen] = useState(false)
  const nav = [['Home', 'home'], ['Prayer Times', 'prayer'], ['Learn', 'learn'], ['Quran', 'quran'], ['About', 'about'], ['Contact', 'contact']]
  const navigate = id => { scrollTo(id); setOpen(false) }
  return <header className="site-header">
    <a className="brand" href="#home" onClick={(e) => { e.preventDefault(); navigate('home') }} aria-label="Tanzeem Islami home">
      <img className="brand-logo" src="/assets/tanzeem-logo.png" alt="Tanzeem Islami logo" />
      <span><strong>Tanzeem Islami</strong><small>KHUDAM-UL-QURAN</small></span>
    </a>
    <nav className={open ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
      {nav.map(([label, id]) => <button key={id} onClick={() => navigate(id)}>{label}</button>)}
    </nav>
    <button className="header-cta" onClick={() => navigate('support')}><HeartHandshake size={16} /> Support Us</button>
    <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Open menu">{open ? <X /> : <Menu />}</button>
  </header>
}

function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 700], [0, 120])
  const opacity = useTransform(scrollY, [0, 600], [1, 0])
  return <section id="home" className="hero">
    <div className="hero-orb orb-one" /><div className="hero-orb orb-two" />
    <div className="hero-grid" /><div className="hero-star star-one">✦</div><div className="hero-star star-two">✧</div>
    <Header />
    <motion.div className="hero-content" style={{ y, opacity }}>
      <motion.img className="hero-logo" src="/assets/tanzeem-logo.png" alt="Tanzeem Islami logo" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15, duration: .7 }} />
      <motion.p className="eyebrow hero-eyebrow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25, duration: .7 }}><span /> A journey toward guidance</motion.p>
      <motion.h1 initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .38, duration: .9, ease: [0.22, 1, 0.36, 1] }}>
        <span>Tanzeem Islami</span>
        <em>Khudam-ul-Quran</em>
      </motion.h1>
      <motion.p className="hero-urdu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .7, duration: .8 }}>Learning, living and growing through the light of the Quran and Sunnah.</motion.p>
      <motion.div className="hero-actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .88, duration: .7 }}>
        <Button onClick={() => scrollTo('quran')}>Explore the Quran</Button>
        <Button variant="ghost" onClick={() => scrollTo('learn')}>Islamic learning</Button>
      </motion.div>
    </motion.div>
    <motion.div className="hero-sanctuary" initial={{ opacity: 0, scale: .92, y: 55 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: .48, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
      <div className="sanctuary-glow" />
      <div className="arch arch-back" /><div className="arch arch-front"><div className="arch-window" /><GeometricMark /></div>
      <div className="lantern l-one" /><div className="lantern l-two" />
      <div className="hero-tile"><span>1448</span><small>A year of guidance</small></div>
    </motion.div>
    <button className="scroll-cue" onClick={() => scrollTo('prayer')}><span>Scroll to explore</span><ArrowDown size={17} /></button>
  </section>
}

function PrayerSection() {
  const [city, setCity] = useState('Lahore')
  const { prayers, label, qibla } = prayerByCity[city]
  const { upcoming, countdown } = useClock(prayers)
  return <section id="prayer" className="section prayer-section">
    <div className="section-shell prayer-shell">
      <SectionIntro eyebrow="Time with purpose" title={<>Shape your day<br /><em>around prayer.</em></>} text="View prayer times for your city and prepare for the next call to prayer." />
      <motion.div className="prayer-panel" initial={{ opacity: 0, x: -35 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .75 }}>
        <div className="prayer-panel-head">
          <div><span className="panel-kicker">LIVE PRAYER TIMES</span><h3>{label}</h3></div>
          <label className="city-select"><MapPin size={16}/><select value={city} onChange={e => setCity(e.target.value)} aria-label="Select city">{Object.entries(prayerByCity).map(([value, data]) => <option key={value} value={value}>{data.label}</option>)}</select></label>
        </div>
        <div className="next-prayer"><div><span>Next prayer</span><strong>{upcoming.name}</strong></div><div className="countdown"><small>Next prayer in</small><b>{countdown}</b></div></div>
        <div className="prayer-times">
          {prayers.map(([name, time]) => <div className={upcoming.name === name ? 'prayer-time active' : 'prayer-time'} key={name}><span>{name}</span><b>{time}</b>{upcoming.name === name && <i>Next</i>}</div>)}
        </div>
        <div className="panel-foot"><span><Navigation size={15} />Qibla {qibla}°</span><span>Today’s times · local time</span></div>
      </motion.div>
    </div>
  </section>
}

function CalendarSection() {
  const dateInfo = useMemo(getDateInfo, [])
  return <section id="calendar" className="section calendar-section">
    <div className="calendar-pattern" />
    <div className="section-shell">
      <SectionIntro eyebrow="Hijri calendar" title={<>A more spiritual<br /><em>measure of time.</em></>} text="Stay connected to the Islamic months and the moments that matter." />
      <motion.div className="calendar-layout" initial="hidden" whileInView="visible" viewport={{ once: true, amount: .2 }} variants={{ visible: { transition: { staggerChildren: .13 } } }}>
        <motion.article className="date-card" variants={reveal}>
          <p>Today’s Islamic date</p><h3>{dateInfo.hijri}</h3><div className="date-rule" /><span>{dateInfo.gregorian}</span><div className="date-day">Thursday <i>20</i></div>
        </motion.article>
        <motion.div className="months-grid" variants={reveal}>{hijriMonths.map((month, index) => <div className={month === dateInfo.currentMonth ? 'month active' : 'month'} key={month}><span>{String(index + 1).padStart(2, '0')}</span><b>{month}</b>{month === dateInfo.currentMonth && <i>Current month</i>}</div>)}</motion.div>
      </motion.div>
    </div>
  </section>
}

function WisdomSection() {
  const [hadithIndex, setHadithIndex] = useState(0)
  const hadith = hadiths[hadithIndex]
  return <section className="section wisdom-section">
    <div className="section-shell wisdom-shell">
      <div className="wisdom-heading"><SectionIntro eyebrow="Daily light" title={<>A reminder<br /><em>for the heart.</em></>} /></div>
      <motion.div className="wisdom-cards" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .75 }}>
        <article className="hadith-card"><div className="card-tag"><Quote size={15} /> Hadith of the day <span>{hadith.topic}</span></div><AnimatePresence mode="wait"><motion.div key={hadithIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .35 }}><p className="arabic-copy">{hadith.text}</p><footer><span>{hadith.source}</span><button onClick={() => setHadithIndex((hadithIndex + 1) % hadiths.length)}>Next hadith <ChevronLeft size={17}/></button></footer></motion.div></AnimatePresence></article>
        <article className="ayat-card"><div className="ayat-radiance" /><div className="card-tag"><BookMarked size={15} /> Verse of the day</div><p className="arabic-copy">Allah — there is no deity except Him, the Ever-Living, the Sustainer of all existence.</p><p className="translation">A quiet reminder of the One who sustains every life, every hope and every moment.</p><footer><span>Al-Baqarah · Verse 255</span><button onClick={() => scrollTo('quran')}>Open the Quran <ArrowLeft size={17}/></button></footer></article>
      </motion.div>
    </div>
  </section>
}

function KnowledgeSection() {
  const [selected, setSelected] = useState(0)
  const [name, description, Icon] = knowledgeCards[selected]
  return <section id="learn" className="section knowledge-section">
    <div className="section-shell"><SectionIntro eyebrow="A map of knowledge" title={<>Learn, understand<br />and <em>grow.</em></>} text="Make every route to knowledge a clear, thoughtful and practical experience." align="center" />
      <div className="knowledge-grid">{knowledgeCards.map(([title, text, CardIcon], index) => <motion.button className={selected === index ? 'knowledge-card selected' : 'knowledge-card'} key={title} onClick={() => setSelected(index)} whileHover={{ y: -7 }} transition={{ type: 'spring', stiffness: 290, damping: 20 }}><span className="knowledge-number">{String(index + 1).padStart(2, '0')}</span><CardIcon size={25} strokeWidth={1.45}/><strong>{title}</strong><small>{text}</small><i><ArrowUpRight size={17}/></i></motion.button>)}</div>
      <motion.div className="knowledge-focus" key={name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}><span>Featured path</span><Icon size={24}/><b>{name}</b><p>{description} — with concise lessons, curated references and guidance that connects learning to life.</p><button onClick={() => scrollTo('courses')}>Explore this path <ArrowLeft size={17}/></button></motion.div>
    </div>
  </section>
}

function AzkarSection() {
  const [active, setActive] = useState(0)
  const item = azkar[active]
  return <section id="azkar" className="section azkar-section">
    <div className="section-shell azkar-shell"><SectionIntro eyebrow="Daily remembrance" title={<>A companion<br /><em>for every moment.</em></>} text="Short, meaningful remembrances for the different moments of your day." />
      <div className="azkar-experience"><div className="azkar-list">{azkar.map(([name], index) => <button className={active === index ? 'active' : ''} key={name} onClick={() => setActive(index)}><span>{String(index+1).padStart(2, '0')}</span>{name}<ChevronLeft size={17}/></button>)}</div><AnimatePresence mode="wait"><motion.article key={item[0]} className="azkar-reading" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}><Moon size={27}/><p className="eyebrow"><span />{item[0]}</p><h3>{item[1]}</h3><p>{item[2]}</p><footer>Reference: Sahih Muslim · Daily remembrance</footer></motion.article></AnimatePresence></div>
    </div>
  </section>
}

function CoursesSection() {
  const [course, setCourse] = useState(null)
  return <section id="courses" className="section courses-section">
    <div className="section-shell"><div className="courses-top"><SectionIntro eyebrow="Structured learning" title={<>Make progress<br /><em>with the Quran.</em></>} text="Begin a dignified learning journey with the right level and a teacher’s guidance." /><Button variant="outline" onClick={() => setCourse(courses[0])}>View all programmes</Button></div>
      <div className="courses-grid">{courses.map((entry, index) => <motion.article className="course-card" key={entry[0]} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .5, delay: index * .07 }}><span className="course-no">0{index+1}</span><h3>{entry[0]}</h3><p>{entry[1]}</p><div><span>{entry[2]}</span><span>{entry[3]}</span></div><button onClick={() => setCourse(entry)}>Learn more <ArrowLeft size={16}/></button></motion.article>)}</div>
    </div>
    <AnimatePresence>{course && <motion.div className="course-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCourse(null)}><motion.article className="course-modal" initial={{ scale: .94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .94, y: 20 }} onClick={(e) => e.stopPropagation()}><button className="close-modal" onClick={() => setCourse(null)}><X size={20}/></button><p className="eyebrow"><span /> Learning programme</p><h3>{course[0]}</h3><p>{course[1]}</p><dl><div><dt>Duration</dt><dd>{course[2]}</dd></div><div><dt>Level</dt><dd>{course[3]}</dd></div></dl><Button onClick={() => { setCourse(null); scrollTo('contact') }}>Register your interest</Button></motion.article></motion.div>}</AnimatePresence>
  </section>
}

function QuranSection() {
  const [query, setQuery] = useState('')
  const [current, setCurrent] = useState(quranSurahs[0])
  const [font, setFont] = useState(30)
  const [mode, setMode] = useState('dark')
  const [bookmarked, setBookmarked] = useState(false)
  const filtered = quranSurahs.filter(s => `${s.name} ${s.en}`.toLowerCase().includes(query.toLowerCase()))
  return <section id="quran" className="section quran-section"><div className="section-shell"><SectionIntro eyebrow="The Quran" title={<>A calm place<br /><em>to read and reflect.</em></>} text="Recitation, translation and reflection in one focused, accessible experience." />
    <div className={`quran-reader ${mode}`}><aside><div className="reader-aside-head"><strong>Surah directory</strong><label><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search a surah"/></label></div><div className="surah-list">{filtered.map(s => <button key={s.n} className={s.n === current.n ? 'selected' : ''} onClick={() => setCurrent(s)}><b>{s.n}</b><span><strong>{s.name}</strong><small>{s.en}</small></span><i>{s.ayah}</i></button>)}</div></aside><article className="reader-page"><header><span>{current.name} <i>{current.en}</i></span><div><button aria-label="Decrease font size" onClick={() => setFont(Math.max(22, font - 2))}><Minus size={17}/></button><button aria-label="Increase font size" onClick={() => setFont(Math.min(42, font + 2))}><Plus size={17}/></button><button className={bookmarked ? 'saved' : ''} aria-label="Bookmark passage" onClick={() => setBookmarked(!bookmarked)}><Bookmark size={17} fill={bookmarked ? 'currentColor' : 'none'}/></button><button aria-label="Switch reader colour" onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}><Sun size={17}/></button></div></header><div className="bismillah">In the name of Allah, the Most Compassionate, the Most Merciful</div><p className="quran-arabic" style={{ fontSize: `${font}px` }}>All praise is for Allah — Lord of all worlds, the Most Compassionate, Most Merciful, Master of the Day of Judgment. You alone we worship and You alone we ask for help.</p><div className="translation-block"><span>English translation</span><p>Guide us along the Straight Path — the path of those You have blessed, not those who have earned anger or gone astray.</p></div><footer><button><ChevronRight size={18}/> Previous verses</button><span>Verses 1 — 4</span><button>Next verses <ChevronLeft size={18}/></button></footer></article></div>
  </div></section>
}

function ToolsSection() {
  const [counter, setCounter] = useState(0)
  const [amount, setAmount] = useState(100000)
  const [eligible, setEligible] = useState(true)
  const [qibla, setQibla] = useState(262)
  const zakat = eligible ? Math.round(Number(amount || 0) * .025).toLocaleString('en-US') : '0'
  const useLocation = () => { if (navigator.geolocation) navigator.geolocation.getCurrentPosition(() => setQibla(261), () => setQibla(262)) }
  return <section className="section tools-section"><div className="section-shell"><SectionIntro eyebrow="Everyday tools" title={<>Ease in action,<br /><em>presence in the heart.</em></>} text="Small, useful Islamic tools for a more intentional life." align="center" />
    <div className="tools-grid"><article className="tool-card zakat-tool"><div className="tool-title"><Calculator size={21}/><span>Zakat calculator</span></div><label>Zakatable wealth (PKR)<input type="number" value={amount} onChange={e => setAmount(e.target.value)} /></label><label className="check-label"><input type="checkbox" checked={eligible} onChange={e => setEligible(e.target.checked)}/><i><Check size={13}/></i> Amount meets the nisab threshold</label><div className="zakat-result"><span>Estimated Zakat</span><b>Rs. {zakat}</b></div><small>This is an estimate. Please consult a qualified scholar for guidance on your circumstances.</small></article>
      <article className="tool-card tasbeeh-tool"><div className="tool-title"><Sparkles size={21}/><span>Dhikr counter</span></div><button className="tasbeeh-count" onClick={() => setCounter(counter + 1)} aria-label="Count remembrance"><b>{counter}</b><span>Remember Allah</span></button><div className="tasbeeh-foot"><span>Goal 33</span><button onClick={() => setCounter(0)}><RotateCcw size={15}/> Reset</button></div></article>
      <article className="tool-card qibla-tool"><div className="tool-title"><Compass size={21}/><span>Qibla direction</span></div><div className="compass" style={{ '--turn': `${qibla}deg` }}><i>N</i><span>E</span><b>S</b><em>W</em><div><Navigation fill="currentColor" size={37}/></div></div><p>Qibla: <b>{qibla}°</b> west-southwest</p><button onClick={useLocation}>Use my location <MapPin size={15}/></button></article></div>
  </div></section>
}

function EventsAndAbout() {
  return <><section className="section events-section"><div className="section-shell"><SectionIntro eyebrow="Islamic occasions" title={<>Days worth<br /><em>remembering.</em></>} text="Moments in the Hijri calendar that bring worship, gratitude and connection closer." /><div className="event-line">{[['09', 'Ramadan', 'The month of the Quran'], ['27', 'Laylat al-Qadr', 'Better than a thousand months'], ['01', 'Eid al-Fitr', 'A day of gratitude and joy'], ['09', 'Day of Arafah', 'A day for sincere prayer'], ['10', 'Ashura', 'A remembrance of patience'], ['10', 'Eid al-Adha', 'A message of giving']].map(([date, title, sub], i) => <motion.article key={title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*.07 }}><b>{date}</b><span><strong>{title}</strong><small>{sub}</small></span></motion.article>)}</div></div></section>
  <section id="about" className="section about-section"><div className="about-orbit"><span>Learn</span><i>Live</i><b>Grow</b></div><div className="section-shell about-shell"><div><SectionIntro eyebrow="Who we are" title={<>Building a generation<br />rooted in the <em>Quran.</em></>} text="Tanzeem Islami Anjuman Khudam-ul-Quran is an educational and community initiative devoted to making the wisdom of the Quran and Sunnah present in knowledge, character and service." /><Button variant="outline" onClick={() => scrollTo('contact')}>Get in touch</Button></div><div className="mission-list"><article><span>01</span><h3>Quran education</h3><p>A connected journey from reading, to understanding, to living the Quran.</p></article><article><span>02</span><h3>Character building</h3><p>Bringing Prophetic character into individual and community life.</p></article><article><span>03</span><h3>Community service</h3><p>Turning the fruit of knowledge into benefit for the wider community.</p></article></div></div></section></>
}

function ContactSection() {
  const [donation, setDonation] = useState('Education')
  const [sent, setSent] = useState(false)
  return <section id="contact" className="section contact-section"><div id="support" className="section-shell contact-shell"><div className="support-callout"><div className="support-flare"/><p className="eyebrow"><span />Support Quran education</p><h2>Keep the light of<br /><em>learning alive.</em></h2><p>Your support reaches Quran education, student care and community service.</p><div className="donation-options">{['Education', 'Quran distribution', 'Student support', 'General support'].map(option => <button key={option} onClick={() => setDonation(option)} className={donation === option ? 'active' : ''}>{donation === option && <Check size={13}/>} {option}</button>)}</div><Button onClick={() => setSent(true)}>Secure donation form <HeartHandshake size={17}/></Button>{sent && <p className="success-note"><Check size={16}/> Thank you — please contact the organisation to add a secure payment method.</p>}</div><div className="contact-details"><p className="eyebrow"><span />Contact</p><h3>For your questions,<br />we are <em>here.</em></h3><a href="tel:+923001234567"><Phone size={18}/><span>Phone</span><b dir="ltr">+92 300 123 4567</b></a><a href="mailto:info@khudamulquran.org"><Mail size={18}/><span>Email</span><b>info@khudamulquran.org</b></a><div><MapPin size={18}/><span>Centre</span><b>Lahore, Pakistan</b></div><div className="socials"><button aria-label="Facebook">f</button><button aria-label="Instagram">◎</button><button aria-label="YouTube">▶</button></div></div></div></section>
}

function Footer() { return <footer className="site-footer"><div className="footer-top"><a className="brand" href="#home" onClick={(e) => {e.preventDefault(); scrollTo('home')}}><GeometricMark small/><span><strong>Tanzeem Islami</strong><small>KHUDAM-UL-QURAN</small></span></a><p>Learning, living and growing through the light of the Quran and Sunnah.</p><div>{[['Home','home'],['Quran','quran'],['Prayer times','prayer'],['Courses','courses'],['Contact','contact']].map(([l,id]) => <button key={id} onClick={() => scrollTo(id)}>{l}</button>)}</div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Tanzeem Islami Anjuman Khudam-ul-Quran</span><span>Made with sincerity for the Ummah</span></div></footer> }

function App() {
  return <main><Hero/><PrayerSection/><CalendarSection/><WisdomSection/><KnowledgeSection/><AzkarSection/><CoursesSection/><QuranSection/><ToolsSection/><EventsAndAbout/><ContactSection/><Footer/></main>
}

export default App

createRoot(document.getElementById('root')).render(<App />)
