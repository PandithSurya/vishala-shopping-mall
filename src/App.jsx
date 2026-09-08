import React, { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('Home')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isAboutInView, setIsAboutInView] = useState(false)
  const [translateProgress, setTranslateProgress] = useState(0)

  // Mute state for both reels
  const [isLeftMuted, setIsLeftMuted] = useState(true)
  const [isRightMuted, setIsRightMuted] = useState(true)

  const leftVideoRef = useRef(null)
  const rightVideoRef = useRef(null)
  const aboutScrollTrackRef = useRef(null)
  const categoriesScrollTrackRef = useRef(null)
  const branchesSectionRef = useRef(null)

  const [categoriesProgress, setCategoriesProgress] = useState(0)
  const [isBranchesInView, setIsBranchesInView] = useState(false)
  const [activeReviewIndex, setActiveReviewIndex] = useState(0)
  const targetCategoriesProgress = useRef(0)
  const currentCategoriesProgress = useRef(0)
  const targetTranslateProgress = useRef(0)
  const currentTranslateProgress = useRef(0)
  const rafId = useRef(null)

  const navItems = ['Home', 'About', 'Categories', 'Branches', 'Reviews', 'Contact']

  const reviewsData = [
    {
      id: 1,
      name: 'Sandy Ranam',
      initials: 'SR',
      role: 'Local Guide · 21 reviews · 4 photos',
      rating: 5,
      time: '1 year ago',
      theme: 'dark-navy',
      textColor: 'light',
      text: 'Vemulawada Vishala Shopping Mall offers a fantastic clothing collection, especially for ethnic wear lovers. The sarees, dresses, and traditional outfits are beautifully displayed and made from quality fabrics. Prices are reasonable, making it a great destination.'
    },
    {
      id: 2,
      name: 'Yella swamy Vanarashi',
      initials: 'YS',
      role: 'Local Guide · 30 reviews · 136 photos',
      rating: 5,
      time: '5 years ago',
      theme: 'deep-emerald',
      textColor: 'light',
      text: 'Clothing is excellent inside lights effect attract more on sarees and dresses.'
    },
    {
      id: 3,
      name: 'VISHNU KUMAR NAGUBOTHU',
      initials: 'VN',
      role: 'Local Guide · 589 reviews · 1,365 photos',
      rating: 5,
      time: '6 years ago',
      theme: 'temple-maroon',
      textColor: 'light',
      text: 'THE BEST SHOPPING MALL IN VEMULAWADA. ALL CLOTHING AVAILABLE'
    },
    {
      id: 4,
      name: 'JANAGAMA SWETHA',
      initials: 'JS',
      role: 'Local Guide · 18 reviews · 116 photos',
      rating: 5,
      time: '5 years ago',
      theme: 'dusty-plum',
      textColor: 'light',
      text: 'Nice sarees and dresses with reasonable prices.'
    },
    {
      id: 5,
      name: 'Sneha',
      initials: 'SN',
      role: 'Local Guide · 96 reviews · 12 photos',
      rating: 5,
      time: '5 years ago',
      theme: 'warm-silk',
      textColor: 'dark',
      text: 'Good, dresses are with reasonable costs and wonderful ethnic collections.'
    },
    {
      id: 6,
      name: 'santhosh vadathya',
      initials: 'SV',
      role: 'Local Guide · 101 reviews · 21 photos',
      rating: 5,
      time: '4 years ago',
      theme: 'dark-slate',
      textColor: 'light',
      text: 'Clothes best brands and quality fabrics.'
    },
    {
      id: 7,
      name: 'Mahesh Reddy',
      initials: 'MR',
      role: 'Local Guide · 82 reviews · 74 photos',
      rating: 5,
      time: '5 years ago',
      theme: 'deep-burgundy',
      textColor: 'light',
      text: 'Good clothing and great shopping experience.'
    },
    {
      id: 8,
      name: 'Duggu Venkatesh',
      initials: 'DV',
      role: '11 reviews · Verified Patron',
      rating: 5,
      time: '5 years ago',
      theme: 'terracotta-umber',
      textColor: 'light',
      text: 'Good clothes available.'
    },
    {
      id: 9,
      name: 'Kamalakar Kshatriya',
      initials: 'KK',
      role: 'Local Guide · 37 reviews · 8 photos',
      rating: 5,
      time: '5 years ago',
      theme: 'deep-sage',
      textColor: 'light',
      text: 'Clothing collection is top quality and traditional.'
    },
    {
      id: 10,
      name: 'Bhaskar Likkidiwar',
      initials: 'BL',
      role: '7 reviews · Verified Patron',
      rating: 5,
      time: '5 years ago',
      theme: 'warm-clay',
      textColor: 'dark',
      text: 'Over all good but need variety in garments and focus more on attending more customers.'
    }
  ]

  // Touch and drag gesture state for Reviews Fan-Deck
  const reviewDragStartX = useRef(0)
  const reviewDragDistance = useRef(0)
  const isReviewDragging = useRef(false)
  const [reviewDragOffset, setReviewDragOffset] = useState(0)

  const handleReviewPointerDown = (clientX) => {
    reviewDragStartX.current = clientX
    reviewDragDistance.current = 0
    isReviewDragging.current = true
  }

  const handleReviewPointerMove = (clientX) => {
    if (!isReviewDragging.current) return
    const diff = clientX - reviewDragStartX.current
    reviewDragDistance.current = diff
    setReviewDragOffset(Math.max(-70, Math.min(70, diff * 0.35)))
  }

  const handleReviewPointerUp = () => {
    if (!isReviewDragging.current) return
    isReviewDragging.current = false
    const finalDiff = reviewDragDistance.current
    setReviewDragOffset(0)

    if (finalDiff < -40) {
      // Swiped left -> next card
      setActiveReviewIndex((prev) => (prev + 1) % reviewsData.length)
    } else if (finalDiff > 40) {
      // Swiped right -> previous card
      setActiveReviewIndex((prev) => (prev - 1 + reviewsData.length) % reviewsData.length)
    }
  }

  const handleReviewCardClick = (index) => {
    if (Math.abs(reviewDragDistance.current) < 12) {
      setActiveReviewIndex(index)
    }
  }

  // Category items with user's images in public folder
  const categoryItems = [
    {
      id: '01',
      name: 'Ladies Wear',
      tag: 'Pure Silks & Bridal',
      subtitle: 'Legendary Kanchipuram & Designer Lehengas',
      description:
        'Immerse in pure Kanchipuram, Banarasi, and Gadwal silks alongside bespoke bridal couture and festive designer ensembles crafted with genuine gold zari.',
      image: '/ladies-section.jpg'
    },
    {
      id: '02',
      name: 'Gents Wear',
      tag: 'Royal Groom & Ethnic',
      subtitle: 'Wedding Sherwanis & Jodhpuri Suits',
      description:
        'Impeccable royal tailoring featuring grand wedding sherwanis, classic Jodhpuris, heritage festive dhotis, and luxury modern ethnic wear.',
      image: '/gents-section.jpg'
    },
    {
      id: '03',
      name: 'Kids Wear',
      tag: 'Celebration Silks',
      subtitle: 'Traditional Pattu Pavadas & Western Sets',
      description:
        'Charming traditional silks, lightweight festive pattu pavadas, and elegant party outfits designed with gentle comfort for the youngest royalty.',
      image: '/kids-section.jpg'
    }
  ]

  // English & Telugu Word Arrays for word-by-word scroll transition
  const englishWords = [
    'Vishala', 'Shopping', 'Mall', 'brings', 'together', 'centuries', 'of',
    'artisanal', 'mastery', 'with', 'modern', 'retail', 'luxury.', 'Designed',
    'to', 'offer', 'an', 'unmatched', 'shopping', 'experience', 'for',
    'families,', 'connoisseurs,', 'and', 'visitors', 'across', 'Telangana.'
  ]

  const teluguWords = [
    'శతాబ్దాల', 'కళా', 'నైపుణ్యాన్ని', 'ఆధునిక', 'వైభవంతో', 'మేళవించిన',
    'విశాల', 'షాపింగ్', 'మాల్.', 'తెలంగాణ', 'ప్రజలకు,', 'కుటుంబాలకు',
    'మరియు', 'సౌందర్య', 'ప్రియులకు', 'అపురూపమైన', 'షాపింగ్', 'అనుభూతిని', 'అందిస్తోంది.'
  ]

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Handle video sound toggles
  const toggleLeftAudio = (e) => {
    e.stopPropagation()
    if (leftVideoRef.current) {
      leftVideoRef.current.muted = !leftVideoRef.current.muted
      setIsLeftMuted(leftVideoRef.current.muted)
    }
  }

  const toggleRightAudio = (e) => {
    e.stopPropagation()
    if (rightVideoRef.current) {
      rightVideoRef.current.muted = !rightVideoRef.current.muted
      setIsRightMuted(rightVideoRef.current.muted)
    }
  }

  // Showcase section reels state
  const [isReel1Muted, setIsReel1Muted] = useState(true)
  const [isReel2Muted, setIsReel2Muted] = useState(true)
  const showcaseReel1Ref = useRef(null)
  const showcaseReel2Ref = useRef(null)

  const toggleReel1Audio = (e) => {
    e.stopPropagation()
    if (showcaseReel1Ref.current) {
      showcaseReel1Ref.current.muted = !showcaseReel1Ref.current.muted
      setIsReel1Muted(showcaseReel1Ref.current.muted)
    }
  }

  const toggleReel2Audio = (e) => {
    e.stopPropagation()
    if (showcaseReel2Ref.current) {
      showcaseReel2Ref.current.muted = !showcaseReel2Ref.current.muted
      setIsReel2Muted(showcaseReel2Ref.current.muted)
    }
  }

  // Sticky Scroll Translation & Header Detection
  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // 1. Header morph state
      if (currentScrollY > 60) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
        setIsHidden(false)
      }

      if (currentScrollY > 180) {
        if (currentScrollY > lastScrollY + 4) {
          setIsHidden(true)
        } else if (currentScrollY < lastScrollY - 4) {
          setIsHidden(false)
        }
      } else {
        setIsHidden(false)
      }

      // 2. Track About sticky translation progress
      if (aboutScrollTrackRef.current) {
        const rect = aboutScrollTrackRef.current.getBoundingClientRect()
        const totalScrollable = rect.height - window.innerHeight

        if (rect.top <= window.innerHeight * 0.75 && rect.bottom >= 0) {
          setIsAboutInView(true)
        }

        if (totalScrollable > 0) {
          const scrolledDistance = -rect.top
          const progress = Math.min(1, Math.max(0, scrolledDistance / totalScrollable))
          targetTranslateProgress.current = progress
        }
      }

      // 3. Track Categories sticky target progress
      if (categoriesScrollTrackRef.current) {
        const rect = categoriesScrollTrackRef.current.getBoundingClientRect()
        const totalScrollable = rect.height - window.innerHeight
        if (totalScrollable > 0) {
          const scrolledDistance = -rect.top
          const progress = Math.min(1, Math.max(0, scrolledDistance / totalScrollable))
          targetCategoriesProgress.current = progress
        }
      }

      // 4. Track Branches section in-view
      if (branchesSectionRef.current) {
        const rect = branchesSectionRef.current.getBoundingClientRect()
        if (rect.top <= window.innerHeight * 0.95 && rect.bottom >= 0) {
          setIsBranchesInView(true)
        }
      }

      lastScrollY = currentScrollY
    }

    // High performance RAF loop for silky smooth 60/120fps motion interpolation
    let isRunning = true
    const loop = () => {
      // Categories lerp
      const catDiff = targetCategoriesProgress.current - currentCategoriesProgress.current
      if (Math.abs(catDiff) > 0.0003) {
        currentCategoriesProgress.current += catDiff * 0.16
        setCategoriesProgress(currentCategoriesProgress.current)
      } else if (currentCategoriesProgress.current !== targetCategoriesProgress.current) {
        currentCategoriesProgress.current = targetCategoriesProgress.current
        setCategoriesProgress(currentCategoriesProgress.current)
      }

      // About translation lerp
      const transDiff = targetTranslateProgress.current - currentTranslateProgress.current
      if (Math.abs(transDiff) > 0.0003) {
        currentTranslateProgress.current += transDiff * 0.16
        setTranslateProgress(currentTranslateProgress.current)
      } else if (currentTranslateProgress.current !== targetTranslateProgress.current) {
        currentTranslateProgress.current = targetTranslateProgress.current
        setTranslateProgress(currentTranslateProgress.current)
      }

      if (isRunning) {
        rafId.current = requestAnimationFrame(loop)
      }
    }

    // Branches Section In-View IntersectionObserver
    let branchesObserver = null
    if (branchesSectionRef.current) {
      branchesObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsBranchesInView(true)
            }
          })
        },
        { threshold: 0.01, rootMargin: '150px 0px 100px 0px' }
      )
      branchesObserver.observe(branchesSectionRef.current)
    }

    rafId.current = requestAnimationFrame(loop)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      isRunning = false
      if (rafId.current) cancelAnimationFrame(rafId.current)
      window.removeEventListener('scroll', handleScroll)
      if (branchesObserver) branchesObserver.disconnect()
    }
  }, [])

  const scrollToSection = (id) => {
    setActiveSection(id)
    setIsMobileMenuOpen(false)
    const element = document.getElementById(id.toLowerCase())
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Smoothstep interpolation helper (zero jerky acceleration / deceleration discontinuities)
  const smoothstep = (min, max, val) => {
    const x = Math.max(0, Math.min(1, (val - min) / (max - min)))
    return x * x * (3 - 2 * x)
  }

  // Categories Scroll Animation Calculations (Buttery Smooth Sequential Alignment)
  // 1. Header Text Slides Up and Fades Out smoothly (progress 0.0 -> 0.14)
  const headerDisappearRatio = smoothstep(0.0, 0.14, categoriesProgress)
  const headerOffsetY = -headerDisappearRatio * 65
  const headerOpacity = Math.max(0, 1 - headerDisappearRatio * 1.15)
  const headerMarginBottom = Math.max(0, (1 - headerDisappearRatio) * 1.8)
  const headerMaxHeight = Math.max(0, (1 - headerDisappearRatio) * 130)

  // 2. Step 1 (progress 0.10 -> 0.52): Card 2 rises to meet Card 1 (50% -> 0%)
  const t1 = smoothstep(0.10, 0.52, categoriesProgress)

  // 3. Step 2 (progress 0.50 -> 0.90): Card 3 rises to align with Cards 1 & 2 (50% -> 0%)
  const t2 = smoothstep(0.50, 0.90, categoriesProgress)

  // Card 1: locked in position
  const card1Offset = 0
  const card1Opacity = 1

  // Card 2: starts halfway down Card 1 (50%) and smoothly rises to 0%
  const card2Offset = (1 - t1) * 50
  const card2Opacity = 0.88 + t1 * 0.12

  // Card 3: starts at 100%, smoothly rises to 50% in Step 1, then to 0% in Step 2
  let card3Offset = 100
  let card3Opacity = 0.78
  if (categoriesProgress < 0.50) {
    card3Offset = 100 - t1 * 50
    card3Opacity = 0.78 + t1 * 0.12
  } else {
    card3Offset = (1 - t2) * 50
    card3Opacity = 0.90 + t2 * 0.10
  }

  return (
    <div className="app-container">
      {/* 1. Header / Navbar — Ivory transformed to floating capsule on scroll */}
      <div
        className={`header-wrapper ${isScrolled ? 'is-scrolled' : ''} ${
          isHidden ? 'header-hidden' : ''
        }`}
      >
        <header className="navbar">
          <div className="navbar-container">
            <a
              href="#home"
              className="navbar-brand"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('Home')
              }}
            >
              <img
                src="/vishala-logo.png"
                alt="Vishala Logo"
                className="navbar-brand-logo"
              />
              <span className="navbar-logo-text">VISHALA</span>
            </a>

            {/* Desktop Navigation */}
            <nav className="desktop-nav">
              <ul className="nav-menu">
                {navItems.map((item) => (
                  <li key={item} className="nav-item">
                    <button
                      type="button"
                      className={`nav-link ${activeSection === item ? 'active' : ''}`}
                      onClick={() => scrollToSection(item)}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right Action Area */}
            <div className="navbar-right-actions">
              <button
                type="button"
                className="navbar-cta"
                onClick={() => scrollToSection('Categories')}
              >
                Shop Now
              </button>

              {/* Mobile Menu Hamburger Toggle */}
              <button
                type="button"
                className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
                aria-expanded={isMobileMenuOpen}
              >
                <span className="hamburger-line line-1" />
                <span className="hamburger-line line-2" />
                <span className="hamburger-line line-3" />
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-nav-drawer ${isMobileMenuOpen ? 'drawer-open' : ''}`}>
        <div
          className="mobile-nav-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div className="mobile-nav-content">
          <div className="mobile-nav-header">
            <div className="mobile-nav-brand">
              <img
                src="/vishala-logo.png"
                alt="Vishala Logo"
                className="mobile-nav-logo"
              />
              <span className="mobile-nav-title">VISHALA</span>
            </div>
            <button
              type="button"
              className="mobile-nav-close"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <ul className="mobile-nav-list">
            {navItems.map((item) => (
              <li key={item} className="mobile-nav-item">
                <button
                  type="button"
                  className={`mobile-nav-link ${activeSection === item ? 'active' : ''}`}
                  onClick={() => scrollToSection(item)}
                >
                  <span className="mobile-nav-link-text">{item}</span>
                  <span className="mobile-nav-arrow">→</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mobile-nav-footer">
            <button
              type="button"
              className="mobile-nav-cta"
              onClick={() => scrollToSection('Categories')}
            >
              Explore Collections
            </button>
            <div className="mobile-nav-branches">
              <span>Siricilla</span>
              <span className="dot">•</span>
              <span>Vemulawada</span>
              <span className="dot">•</span>
              <span>Siddipet</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Hero Section — 2 Reels with Reference Angles & Centerpiece */}
      <section id="home" className="hero-section">
        <div className="hero-backdrop-glow" />

        <div className="hero-showcase-grid">
          {/* Left Reel — Angled as per reference */}
          <div className="reel-column reel-col-left">
            <div className="reel-card reel-left">
              <video
                ref={leftVideoRef}
                className="reel-video"
                src="/vishala-reel1.mp4"
                autoPlay
                loop
                muted={isLeftMuted}
                playsInline
              />

              {/* Sound Button at Bottom-Right matching reference */}
              <button
                type="button"
                className="reel-sound-btn-bottom-right"
                onClick={toggleLeftAudio}
                title={isLeftMuted ? 'Unmute' : 'Mute'}
                aria-label={isLeftMuted ? 'Unmute video' : 'Mute video'}
              >
                {isLeftMuted ? (
                  <svg className="sound-icon" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                  </svg>
                ) : (
                  <svg className="sound-icon" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Middle Centerpiece: Vishala Logo + Mall Title + 3 Branches */}
          <div className="hero-centerpiece">
            <div className="hero-logo-container">
              <img
                src="/vishala-logo.png"
                alt="Vishala Shopping Mall Logo"
                className="hero-logo-img"
              />
            </div>

            <span className="hero-eyebrow-tag">
              The Grand Heritage Destination
            </span>

            <h1 className="hero-mall-title">VISHALA SHOPPING MALL</h1>

            <div className="hero-branches-row">
              <span className="hero-branch-name">Siricilla</span>
              <span className="hero-branch-divider">|</span>
              <span className="hero-branch-name">Vemulawada</span>
              <span className="hero-branch-divider">|</span>
              <span className="hero-branch-name">Siddipet</span>
            </div>

            <div className="hero-center-actions">
              <button
                type="button"
                className="hero-primary-btn"
                onClick={() => scrollToSection('Categories')}
              >
                Explore Collections
              </button>
              <button
                type="button"
                className="hero-secondary-btn"
                onClick={() => scrollToSection('Branches')}
              >
                Visit Branches
              </button>
            </div>
          </div>

          {/* Right Reel — Angled as per reference */}
          <div className="reel-column reel-col-right">
            <div className="reel-card reel-right">
              <video
                ref={rightVideoRef}
                className="reel-video"
                src="/vishala-reel2.mp4"
                autoPlay
                loop
                muted={isRightMuted}
                playsInline
              />

              {/* Sound Button at Bottom-Right matching reference */}
              <button
                type="button"
                className="reel-sound-btn-bottom-right"
                onClick={toggleRightAudio}
                title={isRightMuted ? 'Unmute' : 'Mute'}
                aria-label={isRightMuted ? 'Unmute video' : 'Mute video'}
              >
                {isRightMuted ? (
                  <svg className="sound-icon" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                  </svg>
                ) : (
                  <svg className="sound-icon" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. About Section — Sticky Scroll-Driven Word-by-Word Telugu Translation */}
      <section
        id="about"
        ref={aboutScrollTrackRef}
        className="about-scroll-track"
      >
        <div className={`about-heritage-sticky ${isAboutInView ? 'in-view' : ''}`}>
          {/* Subtle Royal Heritage Watermark & Radiant Halo */}
          <div className="about-mandala-pattern" />
          <div className="about-corner-decor corner-tl">✦</div>
          <div className="about-corner-decor corner-tr">✦</div>
          <div className="about-corner-decor corner-bl">✦</div>
          <div className="about-corner-decor corner-br">✦</div>

          {/* Left Elephant */}
          <div className="elephant-wrapper elephant-left-wrapper">
            <img
              src="/elephant-left.png"
              alt="Royal Elephant Left"
              className="elephant-img elephant-left-img"
            />
            <div className="elephant-ground-shadow" />
          </div>

          {/* Center Stage: Royal Heritage Display & Word-by-Word Translation */}
          <div className="about-center-stage">
            {/* Royal Eyebrow Badge */}
            <div className="about-royal-badge">
              <span className="badge-sparkle">✦</span>
              <span className="badge-text">THE ESSENCE OF ROYAL HERITAGE</span>
              <span className="badge-sparkle">✦</span>
            </div>

            {/* Brand Logo & VISHALA Title with Subtitle */}
            <div className="about-brand-header">
              <div className="about-brand-logo-ring">
                <img
                  src="/vishala-logo.png"
                  alt="Vishala Logo"
                  className="about-brand-logo-img"
                />
              </div>
              <div className="about-brand-text-block">
                <span className="about-brand-title">VISHALA</span>
                <span className="about-brand-subtitle">SHOPPING MALL</span>
              </div>
            </div>

            {/* Word-by-Word Transition Stack */}
            <div className="about-statement-stack">
              {/* English Words Container */}
              <p
                className="about-grand-statement english-statement"
                style={{ pointerEvents: translateProgress > 0.6 ? 'none' : 'auto' }}
              >
                {englishWords.map((word, index) => {
                  const startThresh = 0.12 + (index / englishWords.length) * 0.55
                  const endThresh = startThresh + 0.08
                  let wordOpacity = 1
                  let wordShiftY = 0
                  let wordBlur = 0
                  let wordColor = '#7E1F26'

                  if (translateProgress >= startThresh && translateProgress < endThresh) {
                    const ratio = (translateProgress - startThresh) / 0.08
                    wordOpacity = 1 - ratio
                    wordShiftY = -ratio * 12
                    wordBlur = ratio * 5
                    wordColor = '#D0B477'
                  } else if (translateProgress >= endThresh) {
                    wordOpacity = 0
                    wordShiftY = -12
                    wordBlur = 5
                  }

                  return (
                    <span
                      key={'en-' + index}
                      className="word-span english-word"
                      style={{
                        opacity: wordOpacity,
                        transform: `translateY(${wordShiftY}px)`,
                        filter: `blur(${wordBlur}px)`,
                        color: wordColor
                      }}
                    >
                      {word}{' '}
                    </span>
                  )
                })}
              </p>

              {/* Telugu Words Container (Noto Serif Telugu) */}
              <p
                className="about-grand-statement telugu-statement"
                style={{ pointerEvents: translateProgress <= 0.3 ? 'none' : 'auto' }}
              >
                {teluguWords.map((word, index) => {
                  const startThresh = 0.16 + (index / teluguWords.length) * 0.55
                  const endThresh = startThresh + 0.08
                  let wordOpacity = 0
                  let wordShiftY = 12
                  let wordBlur = 6
                  let wordColor = '#D0B477'

                  if (translateProgress >= startThresh && translateProgress < endThresh) {
                    const ratio = (translateProgress - startThresh) / 0.08
                    wordOpacity = ratio
                    wordShiftY = (1 - ratio) * 12
                    wordBlur = (1 - ratio) * 6
                    wordColor = '#D0B477'
                  } else if (translateProgress >= endThresh) {
                    wordOpacity = 1
                    wordShiftY = 0
                    wordBlur = 0
                    wordColor = '#7E1F26'
                  }

                  return (
                    <span
                      key={'te-' + index}
                      className="word-span telugu-word"
                      style={{
                        opacity: wordOpacity,
                        transform: `translateY(${wordShiftY}px)`,
                        filter: `blur(${wordBlur}px)`,
                        color: wordColor
                      }}
                    >
                      {word}{' '}
                    </span>
                  )
                })}
              </p>
            </div>

            {/* 3 Heritage Highlight Badges */}
            <div className="about-heritage-highlights">
              <div className="heritage-pill">
                <span className="pill-dot">✦</span>
                <span className="pill-text">3 Mega Branches</span>
              </div>
              <div className="heritage-pill-separator">•</div>
              <div className="heritage-pill">
                <span className="pill-dot">✦</span>
                <span className="pill-text">Centuries of Mastery</span>
              </div>
              <div className="heritage-pill-separator">•</div>
              <div className="heritage-pill">
                <span className="pill-dot">✦</span>
                <span className="pill-text">Grand Retail Luxury</span>
              </div>
            </div>
          </div>

          {/* Right Elephant */}
          <div className="elephant-wrapper elephant-right-wrapper">
            <img
              src="/elephant-right.png"
              alt="Royal Elephant Right"
              className="elephant-img elephant-right-img"
            />
            <div className="elephant-ground-shadow" />
          </div>
        </div>
      </section>

      {/* 4. Categories Section — Scroll-Linked Staggered Rise */}
      <section
        id="categories"
        ref={categoriesScrollTrackRef}
        className="categories-scroll-track"
      >
        <div className="categories-sticky-wrapper">
          {/* Royal Peacock Pattern & Sculpture Backdrop towards Right Side */}
          <div className="categories-peacock-backdrop" aria-hidden="true">
            <div className="categories-peacock-pattern-glow" />
            <div className="categories-peacock-radial-aura" />
            <img
              src="/peacock-right.png"
              alt="Royal Peacock Heritage Motif"
              className="categories-peacock-sculpture"
            />
          </div>

          <div className="categories-inner-container">
            {/* Header (Slides Up & Becomes Invisible before card scroll begins) */}
            <div
              className="categories-header"
              style={{
                transform: `translateY(${headerOffsetY}px)`,
                opacity: headerOpacity,
                maxHeight: `${headerMaxHeight}px`,
                marginBottom: `${headerMarginBottom}rem`,
                pointerEvents: headerOpacity <= 0.05 ? 'none' : 'auto'
              }}
            >
              <h2 className="categories-title">Signature Wardrobe Categories</h2>
              <p className="categories-subtitle">
                Three grand floors of curated luxury, handcrafted silks, and festive couture for Ladies, Gents, and Kids
              </p>
            </div>

            {/* Staggered 3-Card Animated Gallery */}
            <div
              className="categories-cards-grid"
              style={{
                '--card-mobile-progress': categoriesProgress
              }}
            >
              {categoryItems.map((cat, index) => {
                let offset = 0
                let opacity = 1
                if (index === 0) {
                  offset = card1Offset
                  opacity = card1Opacity
                } else if (index === 1) {
                  offset = card2Offset
                  opacity = card2Opacity
                } else if (index === 2) {
                  offset = card3Offset
                  opacity = card3Opacity
                }

                return (
                  <div
                    key={cat.id}
                    className={`category-card category-card-${index + 1}`}
                    style={{
                      '--card-offset-y': `${offset}%`,
                      '--card-opacity': opacity
                    }}
                  >
                    {/* Media Card Image Container - Natural Sizing */}
                    <div className="category-media-card">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="category-card-img"
                        loading="lazy"
                      />
                    </div>

                    {/* Card Info Details */}
                    <div className="category-card-info">
                      <div className="category-card-heading-row">
                        <span className="category-num-badge">{cat.id}</span>
                        <h3 className="category-card-title">{cat.name}</h3>
                      </div>
                      <button
                        type="button"
                        className="category-explore-btn"
                        onClick={() => scrollToSection('Branches')}
                      >
                        <span>Explore Collections</span>
                        <svg className="btn-arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4.5. Infinite Horizontal Showcase Section */}
      <section id="showcase" className="showcase-horizontal-section">
        <div className="showcase-section-header">
          <span className="showcase-eyebrow">THE VISHALA SHOWCASE</span>
          <h2 className="showcase-main-title">Stories in Every Weave</h2>
          <p className="showcase-header-desc">
            Where timeless Kanchipuram silks, festive celebrations, and modern luxury converge.
          </p>
        </div>

        {/* Horizontal Infinite Marquee Viewport */}
        <div className="showcase-horizontal-viewport">
          <div className="showcase-marquee-track">

            {/* Sequence 1 */}
            {/* 1. Model Portrait Card */}
            <div className="showcase-col showcase-col-model">
              <div className="showcase-card showcase-model-card">
                <div className="model-photo-wrapper">
                  <img
                    src="/editorial-model.jpg"
                    alt="Editorial Model"
                    className="model-photo"
                    loading="lazy"
                  />
                </div>
                <p className="model-quote">
                  "Turning artisanal mastery into scroll-stopping festive masterpieces, one weave at a time."
                </p>
              </div>
            </div>

            {/* 2. Dual Stacked Cards: Sliders + Views Reach */}
            <div className="showcase-col showcase-col-stacked">
              <div className="showcase-card showcase-sliders-card">
                <span className="stacked-card-label">HERITAGE MIX</span>
                <div className="sliders-list">
                  <div className="slider-item">
                    <div className="slider-label-row">
                      <span>PURITY</span>
                      <span className="slider-val">99%</span>
                    </div>
                    <div className="slider-track">
                      <div className="slider-fill" style={{ width: '99%' }} />
                      <div className="slider-bead" style={{ left: '99%' }} />
                    </div>
                  </div>
                  <div className="slider-item">
                    <div className="slider-label-row">
                      <span>HERITAGE</span>
                      <span className="slider-val">100%</span>
                    </div>
                    <div className="slider-track">
                      <div className="slider-fill" style={{ width: '100%' }} />
                      <div className="slider-bead" style={{ left: '100%' }} />
                    </div>
                  </div>
                  <div className="slider-item">
                    <div className="slider-label-row">
                      <span>GOLD ZARI</span>
                      <span className="slider-val">98%</span>
                    </div>
                    <div className="slider-track">
                      <div className="slider-fill" style={{ width: '98%' }} />
                      <div className="slider-bead" style={{ left: '98%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="showcase-card showcase-views-card">
                <div className="views-card-header">
                  <span className="views-label">HAPPY FAMILIES REACH</span>
                  <span className="views-stat">2.8M+</span>
                </div>
                <div className="views-chart-box">
                  <svg className="views-chart-svg" viewBox="0 0 280 90" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradShowcase" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#D0B477" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#7E1F26" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0,75 Q 70,70 110,50 T 200,32 T 280,12 L 280,90 L 0,90 Z"
                      fill="url(#chartGradShowcase)"
                    />
                    <path
                      d="M 0,75 Q 70,70 110,50 T 200,32 T 280,12"
                      fill="none"
                      stroke="#D0B477"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <circle cx="110" cy="50" r="4" fill="#F6EFE3" stroke="#D0B477" strokeWidth="2" />
                    <circle cx="200" cy="32" r="4" fill="#F6EFE3" stroke="#D0B477" strokeWidth="2" />
                    <circle cx="280" cy="12" r="4" fill="#F6EFE3" stroke="#D0B477" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 3. Reel 1 Card */}
            <div className="showcase-col showcase-col-reel">
              <div className="showcase-card showcase-video-card">
                <div className="video-card-top-tag">
                  <span className="tag-name">PURE SILKS & BRIDAL</span>
                </div>
                <div className="video-frame-container">
                  <video
                    ref={showcaseReel1Ref}
                    className="showcase-video"
                    src="/showcase-reel1.mp4"
                    autoPlay
                    loop
                    muted={isReel1Muted}
                    playsInline
                  />
                  <button
                    type="button"
                    className="showcase-sound-btn"
                    onClick={toggleReel1Audio}
                    title={isReel1Muted ? 'Unmute video' : 'Mute video'}
                    aria-label={isReel1Muted ? 'Unmute video' : 'Mute video'}
                  >
                    {isReel1Muted ? (
                      <svg className="sound-svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                      </svg>
                    ) : (
                      <svg className="sound-svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="video-bottom-pill">
                  <span>CREATIVE CAMPAIGNS</span>
                </div>
              </div>
            </div>

            {/* 4. Ethos Card with Venn Circles */}
            <div className="showcase-col showcase-col-ethos">
              <div className="showcase-card showcase-ethos-card">
                <span className="ethos-eyebrow">OUR ETHOS</span>
                <h3 className="ethos-statement">
                  Creativity is at the heart of our craft, but so is the art of honoring pure Indian traditions.
                </h3>
                <div className="ethos-venn-container">
                  <div className="venn-circle circle-strategy">
                    <span>PURITY</span>
                  </div>
                  <div className="venn-circle circle-growth">
                    <span>HERITAGE</span>
                  </div>
                </div>
                <p className="ethos-desc">
                  Every weave at Vishala bridges centuries of artisan mastery with contemporary royal elegance, delivering unmatched joy to families across Telangana.
                </p>
              </div>
            </div>

            {/* 5. Reel 2 Card */}
            <div className="showcase-col showcase-col-reel">
              <div className="showcase-card showcase-video-card">
                <div className="video-card-top-tag">
                  <span className="tag-name">FESTIVE CELEBRATIONS</span>
                </div>
                <div className="video-frame-container">
                  <video
                    ref={showcaseReel2Ref}
                    className="showcase-video"
                    src="/showcase-reel2.mp4"
                    autoPlay
                    loop
                    muted={isReel2Muted}
                    playsInline
                  />
                  <button
                    type="button"
                    className="showcase-sound-btn"
                    onClick={toggleReel2Audio}
                    title={isReel2Muted ? 'Unmute video' : 'Mute video'}
                    aria-label={isReel2Muted ? 'Unmute video' : 'Mute video'}
                  >
                    {isReel2Muted ? (
                      <svg className="sound-svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                      </svg>
                    ) : (
                      <svg className="sound-svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="video-bottom-pill">
                  <span>FESTIVE HIGHLIGHTS</span>
                </div>
              </div>
            </div>

            {/* 6. Dual Stacked Cards: Craft Photo + Core Signatures Pills */}
            <div className="showcase-col showcase-col-stacked">
              <div className="showcase-card showcase-craft-photo-card">
                <img
                  src="/heritage-craft.jpg"
                  alt="Heritage Silk Craftsmanship"
                  className="craft-photo"
                  loading="lazy"
                />
                <div className="craft-photo-overlay">
                  <span className="craft-tag">100% CERTIFIED SILK MARK</span>
                </div>
              </div>

              <div className="showcase-card showcase-pills-card">
                <span className="pills-card-eyebrow">CORE SIGNATURES</span>
                <div className="pills-flex-wrap">
                  <span className="showcase-pill">Pure Kanchipuram</span>
                  <span className="showcase-pill">Bridal Lehengas</span>
                  <span className="showcase-pill">Royal Sherwanis</span>
                  <span className="showcase-pill">Pattu Pavadas</span>
                  <span className="showcase-pill">Gadwal Zari</span>
                  <span className="showcase-pill">Handloom Khadi</span>
                </div>
              </div>
            </div>

            {/* Sequence 2 (Duplicate for Seamless Infinite Loop) */}
            <div className="showcase-col showcase-col-model" aria-hidden="true">
              <div className="showcase-card showcase-model-card">
                <div className="model-photo-wrapper">
                  <img
                    src="/editorial-model.jpg"
                    alt="Editorial Model"
                    className="model-photo"
                    loading="lazy"
                  />
                </div>
                <p className="model-quote">
                  "Turning artisanal mastery into scroll-stopping festive masterpieces, one weave at a time."
                </p>
              </div>
            </div>

            <div className="showcase-col showcase-col-stacked" aria-hidden="true">
              <div className="showcase-card showcase-sliders-card">
                <span className="stacked-card-label">HERITAGE MIX</span>
                <div className="sliders-list">
                  <div className="slider-item">
                    <div className="slider-label-row">
                      <span>PURITY</span>
                      <span className="slider-val">99%</span>
                    </div>
                    <div className="slider-track">
                      <div className="slider-fill" style={{ width: '99%' }} />
                      <div className="slider-bead" style={{ left: '99%' }} />
                    </div>
                  </div>
                  <div className="slider-item">
                    <div className="slider-label-row">
                      <span>HERITAGE</span>
                      <span className="slider-val">100%</span>
                    </div>
                    <div className="slider-track">
                      <div className="slider-fill" style={{ width: '100%' }} />
                      <div className="slider-bead" style={{ left: '100%' }} />
                    </div>
                  </div>
                  <div className="slider-item">
                    <div className="slider-label-row">
                      <span>GOLD ZARI</span>
                      <span className="slider-val">98%</span>
                    </div>
                    <div className="slider-track">
                      <div className="slider-fill" style={{ width: '98%' }} />
                      <div className="slider-bead" style={{ left: '98%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="showcase-card showcase-views-card">
                <div className="views-card-header">
                  <span className="views-label">HAPPY FAMILIES REACH</span>
                  <span className="views-stat">2.8M+</span>
                </div>
                <div className="views-chart-box">
                  <svg className="views-chart-svg" viewBox="0 0 280 90" preserveAspectRatio="none">
                    <path
                      d="M 0,75 Q 70,70 110,50 T 200,32 T 280,12 L 280,90 L 0,90 Z"
                      fill="url(#chartGradShowcase)"
                    />
                    <path
                      d="M 0,75 Q 70,70 110,50 T 200,32 T 280,12"
                      fill="none"
                      stroke="#D0B477"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <circle cx="110" cy="50" r="4" fill="#F6EFE3" stroke="#D0B477" strokeWidth="2" />
                    <circle cx="200" cy="32" r="4" fill="#F6EFE3" stroke="#D0B477" strokeWidth="2" />
                    <circle cx="280" cy="12" r="4" fill="#F6EFE3" stroke="#D0B477" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="showcase-col showcase-col-reel" aria-hidden="true">
              <div className="showcase-card showcase-video-card">
                <div className="video-card-top-tag">
                  <span className="tag-name">PURE SILKS & BRIDAL</span>
                </div>
                <div className="video-frame-container">
                  <video
                    className="showcase-video"
                    src="/showcase-reel1.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                <div className="video-bottom-pill">
                  <span>CREATIVE CAMPAIGNS</span>
                </div>
              </div>
            </div>

            <div className="showcase-col showcase-col-ethos" aria-hidden="true">
              <div className="showcase-card showcase-ethos-card">
                <span className="ethos-eyebrow">OUR ETHOS</span>
                <h3 className="ethos-statement">
                  Creativity is at the heart of our craft, but so is the art of honoring pure Indian traditions.
                </h3>
                <div className="ethos-venn-container">
                  <div className="venn-circle circle-strategy">
                    <span>PURITY</span>
                  </div>
                  <div className="venn-circle circle-growth">
                    <span>HERITAGE</span>
                  </div>
                </div>
                <p className="ethos-desc">
                  Every weave at Vishala bridges centuries of artisan mastery with contemporary royal elegance, delivering unmatched joy to families across Telangana.
                </p>
              </div>
            </div>

            <div className="showcase-col showcase-col-reel" aria-hidden="true">
              <div className="showcase-card showcase-video-card">
                <div className="video-card-top-tag">
                  <span className="tag-name">FESTIVE CELEBRATIONS</span>
                </div>
                <div className="video-frame-container">
                  <video
                    className="showcase-video"
                    src="/showcase-reel2.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                <div className="video-bottom-pill">
                  <span>FESTIVE HIGHLIGHTS</span>
                </div>
              </div>
            </div>

            <div className="showcase-col showcase-col-stacked" aria-hidden="true">
              <div className="showcase-card showcase-craft-photo-card">
                <img
                  src="/heritage-craft.jpg"
                  alt="Heritage Silk Craftsmanship"
                  className="craft-photo"
                  loading="lazy"
                />
              </div>

              <div className="showcase-card showcase-pills-card">
                <span className="pills-card-eyebrow">CORE SIGNATURES</span>
                <div className="pills-flex-wrap">
                  <span className="showcase-pill">Pure Kanchipuram</span>
                  <span className="showcase-pill">Bridal Lehengas</span>
                  <span className="showcase-pill">Royal Sherwanis</span>
                  <span className="showcase-pill">Pattu Pavadas</span>
                  <span className="showcase-pill">Gadwal Zari</span>
                  <span className="showcase-pill">Handloom Khadi</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Branches Section — Grand Flagship Showcase */}
      <section
        id="branches"
        ref={branchesSectionRef}
        className={`branches-luxury-section ${isBranchesInView ? 'is-in-view' : ''}`}
      >
        <div className="branches-container">
          {/* Section Header */}
          <div className="branches-header">
            <div className="branches-eyebrow-pill">
              <span className="branches-eyebrow-dot" />
              <span>STORE LOCATIONS & EXPERIENCES</span>
            </div>
            <h2 className="branches-title">Our Three Flagships</h2>
            <p className="branches-supporting-text">
              Three iconic shopping destinations across Telangana — where royal handloom traditions, opulent multi-floor architecture, and warm hospitality come together.
            </p>
          </div>

          {/* Symmetrical 3-Card Flagship Showcase */}
          <div className="branches-grid">

            {/* 01 SIRICILLA */}
            <article className="branch-card">
              <div className="branch-photo-frame">
                <img
                  src="/siricilla-branch.png"
                  alt="Vishala Shopping Mall Siricilla Flagship"
                  className="branch-photo"
                  loading="lazy"
                />
                <div className="branch-photo-overlay" />
                <div className="branch-top-bar">
                  <span className="branch-number-badge">01 • SIRICILLA</span>
                  <span className="branch-live-badge">
                    <span className="live-status-dot" />
                    Open Today
                  </span>
                </div>
                <div className="branch-bottom-tag">
                  <span>TEXTILE CAPITAL OF TELANGANA</span>
                </div>
              </div>

              <div className="branch-body">
                <div className="branch-header-info">
                  <span className="branch-tagline">BRIDAL & SILK SANCTUARY</span>
                  <h3 className="branch-name">Siricilla Flagship</h3>
                </div>

                <div className="branch-features-grid">
                  <div className="branch-feat-item">
                    <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <line x1="3" y1="9" x2="21" y2="9" />
                      <line x1="9" y1="21" x2="9" y2="9" />
                    </svg>
                    <span>4 Luxury Floors</span>
                  </div>
                  <div className="branch-feat-item">
                    <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span>VIP Bridal Studio</span>
                  </div>
                  <div className="branch-feat-item">
                    <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                      <line x1="9" y1="9" x2="9.01" y2="9" />
                      <line x1="15" y1="9" x2="15.01" y2="9" />
                    </svg>
                    <span>Pure Silks Hub</span>
                  </div>
                  <div className="branch-feat-item">
                    <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span>Family Fashion</span>
                  </div>
                </div>

                <div className="branch-details-box">
                  <div className="branch-meta-row">
                    <svg className="branch-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>Main Textile Road, Siricilla</span>
                  </div>

                  <div className="branch-meta-row">
                    <svg className="branch-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>10:00 AM – 9:30 PM (Daily)</span>
                  </div>
                </div>

                <div className="branch-actions-row">
                  <a
                    href="https://maps.google.com/?q=Vishala+Shopping+Mall+Siricilla"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="branch-action-primary"
                  >
                    <span>GET DIRECTIONS</span>
                    <svg className="action-arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                  <a
                    href="tel:+919848012345"
                    className="branch-action-secondary"
                    title="Call Siricilla Store"
                    aria-label="Call Siricilla Store"
                  >
                    <svg className="phone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span>CALL</span>
                  </a>
                </div>
              </div>
            </article>

            {/* 02 VEMULAWADA */}
            <article className="branch-card">
              <div className="branch-photo-frame">
                <img
                  src="/vemulawada-branch.png"
                  alt="Vishala Shopping Mall Vemulawada Boutique"
                  className="branch-photo"
                  loading="lazy"
                />
                <div className="branch-photo-overlay" />
                <div className="branch-top-bar">
                  <span className="branch-number-badge">02 • VEMULAWADA</span>
                  <span className="branch-live-badge">
                    <span className="live-status-dot" />
                    Open Today
                  </span>
                </div>
                <div className="branch-bottom-tag">
                  <span>TEMPLE HERITAGE DESTINATION</span>
                </div>
              </div>

              <div className="branch-body">
                <div className="branch-header-info">
                  <span className="branch-tagline">TEMPLE WEAVES & FESTIVE SILKS</span>
                  <h3 className="branch-name">Vemulawada Branch</h3>
                </div>

                <div className="branch-features-grid">
                  <div className="branch-feat-item">
                    <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span>Auspicious Pattu</span>
                  </div>
                  <div className="branch-feat-item">
                    <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <line x1="3" y1="9" x2="21" y2="9" />
                      <line x1="9" y1="21" x2="9" y2="9" />
                    </svg>
                    <span>Temple Silks</span>
                  </div>
                  <div className="branch-feat-item">
                    <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                      <line x1="9" y1="9" x2="9.01" y2="9" />
                      <line x1="15" y1="9" x2="15.01" y2="9" />
                    </svg>
                    <span>Pattu Pavadas</span>
                  </div>
                  <div className="branch-feat-item">
                    <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span>Ethnic Dressing</span>
                  </div>
                </div>

                <div className="branch-details-box">
                  <div className="branch-meta-row">
                    <svg className="branch-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>Temple Ring Road, Vemulawada</span>
                  </div>

                  <div className="branch-meta-row">
                    <svg className="branch-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>9:30 AM – 10:00 PM (Daily)</span>
                  </div>
                </div>

                <div className="branch-actions-row">
                  <a
                    href="https://maps.google.com/?q=Vishala+Shopping+Mall+Vemulawada"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="branch-action-primary"
                  >
                    <span>GET DIRECTIONS</span>
                    <svg className="action-arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                  <a
                    href="tel:+919848067890"
                    className="branch-action-secondary"
                    title="Call Vemulawada Store"
                    aria-label="Call Vemulawada Store"
                  >
                    <svg className="phone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span>CALL</span>
                  </a>
                </div>
              </div>
            </article>

            {/* 03 SIDDIPET */}
            <article className="branch-card">
              <div className="branch-photo-frame">
                <img
                  src="/siddipet-branch.png"
                  alt="Vishala Shopping Mall Siddipet Mega Mall"
                  className="branch-photo"
                  loading="lazy"
                />
                <div className="branch-photo-overlay" />
                <div className="branch-top-bar">
                  <span className="branch-number-badge">03 • SIDDIPET</span>
                  <span className="branch-live-badge">
                    <span className="live-status-dot" />
                    Open Today
                  </span>
                </div>
                <div className="branch-bottom-tag">
                  <span>SIGNATURE MEGA PALACE</span>
                </div>
              </div>

              <div className="branch-body">
                <div className="branch-header-info">
                  <span className="branch-tagline">GRAND 3-FLOOR MULTI-STOREY MALL</span>
                  <h3 className="branch-name">Siddipet Mega Mall</h3>
                </div>

                <div className="branch-features-grid">
                  <div className="branch-feat-item">
                    <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <line x1="3" y1="9" x2="21" y2="9" />
                      <line x1="9" y1="21" x2="9" y2="9" />
                    </svg>
                    <span>3-Storey Mega Mall</span>
                  </div>
                  <div className="branch-feat-item">
                    <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span>Groom & Men's Studio</span>
                  </div>
                  <div className="branch-feat-item">
                    <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                      <line x1="9" y1="9" x2="9.01" y2="9" />
                      <line x1="15" y1="9" x2="15.01" y2="9" />
                    </svg>
                    <span>Designer Couture</span>
                  </div>
                  <div className="branch-feat-item">
                    <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2" />
                      <circle cx="7" cy="17" r="2" />
                      <circle cx="17" cy="17" r="2" />
                    </svg>
                    <span>Valet Parking</span>
                  </div>
                </div>

                <div className="branch-details-box">
                  <div className="branch-meta-row">
                    <svg className="branch-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>Heritage Plaza, Main Bazaar, Siddipet</span>
                  </div>

                  <div className="branch-meta-row">
                    <svg className="branch-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>10:00 AM – 9:30 PM (Daily)</span>
                  </div>
                </div>

                <div className="branch-actions-row">
                  <a
                    href="https://maps.google.com/?q=Vishala+Shopping+Mall+Siddipet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="branch-action-primary"
                  >
                    <span>GET DIRECTIONS</span>
                    <svg className="action-arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                  <a
                    href="tel:+919848054321"
                    className="branch-action-secondary"
                    title="Call Siddipet Store"
                    aria-label="Call Siddipet Store"
                  >
                    <svg className="phone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span>CALL</span>
                  </a>
                </div>
              </div>
            </article>

          </div>

          {/* Luxury Concierge Strip */}
          <div className="branches-concierge-strip">
            <div className="concierge-left">
              <div className="concierge-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div className="concierge-text-content">
                <h4 className="concierge-title">Bespoke Bridal & Family Shopping Concierge</h4>
                <p className="concierge-desc">
                  Planning wedding shopping or bulk family celebrations? Book a dedicated stylist and private dressing suite at any branch.
                </p>
              </div>
            </div>
            <div className="concierge-right">
              <a
                href="https://wa.me/919848012345?text=Hello%20Vishala%20Shopping%20Mall,%20I%20would%20like%20to%20inquire%20about%20bridal%20shopping%20assistance"
                target="_blank"
                rel="noopener noreferrer"
                className="concierge-cta-btn"
              >
                <span>CONNECT WITH CONCIERGE</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Google Verified Reviews — Fan-Deck Carousel Section */}
      <section id="reviews" className="reviews-section">
        <div className="reviews-container">
          {/* Section Header */}
          <div className="reviews-header">
            <div className="reviews-eyebrow-pill">
              <svg className="google-icon" viewBox="0 0 24 24" width="16" height="16">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>GOOGLE VERIFIED REVIEWS</span>
            </div>
            <h2 className="reviews-title">Loved by Thousands of Families</h2>
            <p className="reviews-supporting-text">
              Real experiences and authentic ratings shared by our patrons across Telangana.
            </p>
          </div>

          {/* Interactive Fan-Deck Stage with Full Touch & Click Gestures */}
          <div className="reviews-fan-stage">
            <div
              className={`reviews-cards-stack ${isReviewDragging.current ? 'is-dragging' : ''}`}
              onTouchStart={(e) => handleReviewPointerDown(e.touches[0].clientX)}
              onTouchMove={(e) => handleReviewPointerMove(e.touches[0].clientX)}
              onTouchEnd={handleReviewPointerUp}
              onTouchCancel={handleReviewPointerUp}
              onMouseDown={(e) => handleReviewPointerDown(e.clientX)}
              onMouseMove={(e) => handleReviewPointerMove(e.clientX)}
              onMouseUp={handleReviewPointerUp}
              onMouseLeave={handleReviewPointerUp}
            >
              {reviewsData.map((review, index) => {
                let diff = index - activeReviewIndex
                const len = reviewsData.length
                if (diff > len / 2) diff -= len
                if (diff < -len / 2) diff += len

                const isActive = diff === 0
                const isVisible = Math.abs(diff) <= 2

                return (
                  <div
                    key={review.id}
                    className={`review-fan-card theme-${review.theme} ${isActive ? 'is-active' : ''} ${review.textColor === 'dark' ? 'text-dark' : 'text-light'}`}
                    style={{
                      '--diff': diff,
                      '--abs-diff': Math.abs(diff),
                      '--drag-x': `${reviewDragOffset}px`,
                      visibility: isVisible ? 'visible' : 'hidden'
                    }}
                    onClick={() => handleReviewCardClick(index)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Review by ${review.name}`}
                  >
                    <div className="review-card-top">
                      <div className="review-avatar">
                        <span>{review.initials}</span>
                      </div>
                      <div className="review-badge-right">
                        <div className="review-stars-row">
                          <span>★★★★★</span>
                        </div>
                        <div className="google-verified-tag">
                          <svg className="verified-check" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                          <span>GOOGLE VERIFIED REVIEW ↗</span>
                        </div>
                      </div>
                    </div>

                    <div className="review-quote-body">
                      <p>“{review.text}”</p>
                    </div>

                    <div className="review-author-bottom">
                      <div className="review-author-name">– {review.name}</div>
                      <div className="review-author-meta">{review.role} • {review.time}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Navigation Controls */}
            <div className="reviews-nav-controls">
              <button
                onClick={() => setActiveReviewIndex((prev) => (prev - 1 + reviewsData.length) % reviewsData.length)}
                className="reviews-nav-btn prev"
                aria-label="Previous review"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <div className="reviews-dots-row">
                {reviewsData.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    className={`review-dot ${dotIdx === activeReviewIndex ? 'active' : ''}`}
                    onClick={() => setActiveReviewIndex(dotIdx)}
                    aria-label={`Go to review ${dotIdx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveReviewIndex((prev) => (prev + 1) % reviewsData.length)}
                className="reviews-nav-btn next"
                aria-label="Next review"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Editorial Heritage Footer */}
      <footer id="contact" className="editorial-footer">
        {/* Subtle Textile Texture Background Overlay */}
        <div className="footer-textile-pattern" aria-hidden="true" />

        <div className="footer-container">
          
          {/* 1. TOP BRAND STATEMENT (Visual Anchor) */}
          <div className="footer-brand-statement">
            <div className="footer-brand-header">
              <img
                src="/vishala-logo.png"
                alt="Vishala Logo"
                className="footer-brand-logo"
                loading="lazy"
              />
              <div className="footer-brand-names">
                <span className="footer-brand-title">VISHALA</span>
                <span className="footer-brand-subtitle">SHOPPING MALL</span>
              </div>
            </div>
            
            <p className="footer-brand-tagline">
              Tradition, woven into every occasion.
            </p>

            {/* Subtle Low-Contrast Center Divider */}
            <div className="footer-divider-center" aria-hidden="true">
              <span className="footer-divider-line" />
              <span className="footer-divider-symbol">◇</span>
              <span className="footer-divider-line" />
            </div>
          </div>

          {/* 2. MAIN 3-COLUMN EDITORIAL CONTENT */}
          <div className="footer-main-grid">

            {/* COLUMN 1: EXPLORE */}
            <div className="footer-column footer-col-explore">
              <h4 className="footer-col-label">EXPLORE</h4>
              <ul className="footer-links-list">
                <li>
                  <button onClick={() => scrollToSection('Categories')} className="footer-text-link">
                    Categories
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('About')} className="footer-text-link">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('About')} className="footer-text-link">
                    Our Story
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('Branches')} className="footer-text-link">
                    Branches
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('Reviews')} className="footer-text-link">
                    Reviews
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('Contact')} className="footer-text-link">
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* COLUMN 2: VISIT US */}
            <div className="footer-column footer-col-visit">
              <h4 className="footer-col-label">VISIT US</h4>
              <div className="footer-branches-list">
                
                {/* 01 Siricilla */}
                <div className="footer-branch-item">
                  <div className="footer-branch-title-row">
                    <span className="footer-branch-num">01</span>
                    <span className="footer-branch-city">SIRICILLA</span>
                  </div>
                  <p className="footer-branch-address">Main Textile Road, Siricilla</p>
                  <p className="footer-branch-hours">10:00 AM — 9:30 PM</p>
                </div>

                {/* 02 Vemulawada */}
                <div className="footer-branch-item">
                  <div className="footer-branch-title-row">
                    <span className="footer-branch-num">02</span>
                    <span className="footer-branch-city">VEMULAWADA</span>
                  </div>
                  <p className="footer-branch-address">Temple Ring Road, Vemulawada</p>
                  <p className="footer-branch-hours">9:30 AM — 10:00 PM</p>
                </div>

                {/* 03 Siddipet */}
                <div className="footer-branch-item">
                  <div className="footer-branch-title-row">
                    <span className="footer-branch-num">03</span>
                    <span className="footer-branch-city">SIDDIPET</span>
                  </div>
                  <p className="footer-branch-address">Heritage Plaza, Main Bazaar, Siddipet</p>
                  <p className="footer-branch-hours">10:00 AM — 9:30 PM</p>
                </div>

                {/* Simple Text CTA */}
                <button
                  onClick={() => scrollToSection('Branches')}
                  className="footer-view-locations-link"
                >
                  <span className="footer-cta-text">VIEW ALL LOCATIONS</span>
                  <span className="footer-cta-arrow">→</span>
                </button>
              </div>
            </div>

            {/* COLUMN 3: CONNECT */}
            <div className="footer-column footer-col-connect">
              <h4 className="footer-col-label">CONNECT</h4>
              <ul className="footer-links-list">
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-text-link footer-connect-link"
                  >
                    <span>Instagram</span>
                    <span className="footer-arrow-ne">↗</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-text-link footer-connect-link"
                  >
                    <span>Facebook</span>
                    <span className="footer-arrow-ne">↗</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-text-link footer-connect-link"
                  >
                    <span>YouTube</span>
                    <span className="footer-arrow-ne">↗</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-text-link footer-connect-link"
                  >
                    <span>Google Maps</span>
                    <span className="footer-arrow-ne">↗</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/919848012345"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-text-link footer-connect-link"
                  >
                    <span>WhatsApp Concierge</span>
                    <span className="footer-arrow-ne">↗</span>
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* 3. FINAL COPYRIGHT BAR */}
          <div className="footer-bottom-bar">
            <div className="footer-copyright-text">
              © 2026 Vishala Shopping Mall. All rights reserved.
            </div>
            <div className="footer-legal-links">
              <a href="#privacy" className="footer-legal-link">Privacy Policy</a>
              <span className="footer-legal-sep" aria-hidden="true">·</span>
              <a href="#terms" className="footer-legal-link">Terms & Conditions</a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  )
}

export default App
