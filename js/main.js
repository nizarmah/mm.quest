const STATS = [
  {
    id: "kind_moments",
    title: "kind moments",
    icon: "hearts"
  },
  {
    id: "lucky_moments",
    title: "lucky moments",
    icon: "crown"
  },
  {
    id: "romantic_moments",
    title: "romantic moments",
    icon: "heart"
  },
  {
    id: "dressup_moments",
    title: "dressup moments",
    icon: "suit"
  },
  {
    id: "places_stumbled",
    title: "places stumbled",
    icon: "pin"
  },
  {
    id: "memories_captured",
    title: "memories captured",
    icon: "camera"
  },
  {
    id: "items_gifted",
    title: "items gifted",
    icon: "gift"
  },
  {
    id: "hips_swayed",
    title: "hips swayed",
    icon: "disco"
  },
  {
    id: "views_caught",
    title: "views caught",
    icon: "sunset"
  },
  {
    id: "rainbows_chased",
    title: "rainbows chased",
    icon: "rainbow"
  },
  {
    id: "stars_gazed",
    title: "stars gazed",
    icon: "stars"
  },
  {
    id: "storms_walked",
    title: "storms walked",
    icon: "rain"
  },
  {
    id: "drinks_shared",
    title: "drinks shared",
    icon: "beer"
  },
  {
    id: "games_shared",
    title: "games shared",
    icon: "cards"
  },
  {
    id: "songs_shared",
    title: "songs shared",
    icon: "music"
  },
  {
    id: "umbrellas_shared",
    title: "umbrellas shared",
    icon: "umbrella"
  }
]

const statsCache = {
  currentWeek: () => {
    return parseInt(localStorage.getItem("state:current-week"))
  },
  set: (stat, count) => {
    localStorage.setItem(`stat:${stat.id}`, count || 0)
  },
  get: (stat) => {
    return parseInt(localStorage.getItem(`stat:${stat.id}`)) || 0
  },
  clear: (currentWeek) => {
    localStorage.clear()
    localStorage.setItem("state:current-week", currentWeek)
  }
}

const userCache = {
  hasAge: () => {
    return !!localStorage.getItem("user:birthdate")
  },
  getAge: () => {
    return localStorage.getItem("user:birthdate")
  },
  setAge: (value) => {
    localStorage.setItem("user:birthdate", value)
  },
  clear: () => {
    localStorage.removeItem("user:birthdate")
  }
}

const incrementStat = (stat) => {
  const count = parseInt(statsCache.get(stat))
  statsCache.set(stat, count + 1)

  const screen = document.getElementById("screen")
  goToStats(screen)
}

const createStatNode = (stat) => {
  const node = document.createElement("div")
  node.className = "stat"

  const count = document.createElement("span")
  count.className = "stat-count"
  count.textContent = statsCache.get(stat)

  const info = document.createElement("div")
  info.className = "stat-info"

  const icon = document.createElement("img")
  icon.className = "stat-icon"
  icon.src = `assets/${stat.icon}.png`

  const title = document.createElement("div")
  title.className = "stat-title"

  stat.title.split(" ").forEach((word) => {
    const span = document.createElement("span")
    span.textContent = word
    title.appendChild(span)
  })

  info.appendChild(icon)
  info.appendChild(title)

  node.appendChild(count)
  node.appendChild(info)

  node.addEventListener("click", () => {
    incrementStat(stat)
  })

  return node
}

const goToStats = (screen) => {
  screen.innerHTML = ""

  const stats = document.createElement("div")
  stats.className = "stats"

  STATS.forEach((stat) => {
    const statNode = createStatNode(stat)
    stats.appendChild(statNode)
  })

  screen.appendChild(stats)
}

const goToYearMap = (screen) => {
  screen.innerHTML = ""

  const yearMap = document.createElement("div")
  yearMap.className = "year-map"

  const now = new Date()
  const year = now.getFullYear()
  const startOfYear = new Date(year, 0, 1)
  const msPerDay = 24 * 60 * 60 * 1000
  const daysInYear = 365
  const todayIndex = Math.min(Math.floor((now - startOfYear) / msPerDay), daysInYear - 1)

  for (let index = 0; index < daysInYear; index++) {
    const day = document.createElement("div")
    day.className = "year-day"

    if (index < todayIndex) {
      day.classList.add("year-day-past")
    } else if (index > todayIndex) {
      day.classList.add("year-day-future")
    } else {
      day.classList.add("year-day-today")
    }

    yearMap.appendChild(day)
  }

  screen.appendChild(yearMap)
}

const goToLifetimeMap = (screen) => {
  screen.innerHTML = ""

  const lifetimeMap = document.createElement("div")
  lifetimeMap.className = "lifetime-map"

  const weeksInLifetime = 73 * 52

  for (let index = 0; index < weeksInLifetime; index++) {
    const week = document.createElement("div")
    week.className = "lifetime-week"
    lifetimeMap.appendChild(week)
  }

  screen.appendChild(lifetimeMap)
}

const goToAge = (screen) => {
  screen.innerHTML = ""

  const ageScreen = document.createElement("div")
  ageScreen.className = "age-screen"

  const monthInput = document.createElement("input")
  monthInput.className = "age-input"
  monthInput.type = "text"
  monthInput.placeholder = "MM"

  const dayInput = document.createElement("input")
  dayInput.className = "age-input"
  dayInput.type = "text"
  dayInput.placeholder = "DD"

  const yearInput = document.createElement("input")
  yearInput.className = "age-input"
  yearInput.type = "text"
  yearInput.placeholder = "YYYY"

  const button = document.createElement("button")
  button.className = "age-submit"
  button.textContent = "continue"

  const onSubmit = async () => {
    const month = monthInput.value.trim()
    const day = dayInput.value.trim()
    const year = yearInput.value.trim()
    if (!month || !day || !year) {
      return
    }

    const monthNumber = parseInt(month, 10)
    const dayNumber = parseInt(day, 10)
    const yearNumber = parseInt(year, 10)
    const birthdate = new Date(yearNumber, monthNumber - 1, dayNumber)
    const birthdateUnix = birthdate.getTime()

    if (Number.isNaN(birthdateUnix)) {
      await manualReset()
      return
    }

    userCache.setAge(birthdateUnix)
    await startMainFlow(screen)
  }

  button.addEventListener("click", onSubmit)
  monthInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      onSubmit()
    }
  })
  dayInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      onSubmit()
    }
  })
  yearInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      onSubmit()
    }
  })

  ageScreen.appendChild(monthInput)
  ageScreen.appendChild(dayInput)
  ageScreen.appendChild(yearInput)
  ageScreen.appendChild(button)

  screen.appendChild(ageScreen)
}

const goToSplash = (screen) => {
  screen.innerHTML = ""

  const splash = document.createElement("div")
  splash.className = "splash"

  const title = document.createElement("span")
  title.className = "title"
  title.textContent = "mm.quest"

  splash.appendChild(title)

  screen.appendChild(splash)
}

const goToLoader = (screen) => {
  screen.innerHTML = ""

  const loader = document.createElement("div")
  loader.className = "loader"

  const quote = document.createElement("div")
  quote.className = "quote"

  const ferrisBueller = [
    "Life moves pretty fast.",
    "If you don't stop and",
    "look around once in a while,",
    "you could miss it."
  ]

  ferrisBueller.forEach((line) => {
    const span = document.createElement("span")
    span.textContent = line
    quote.appendChild(span)
  })

  const loading = document.createElement("span")
  loading.className = "loading"
  loading.textContent = "loading journal..."

  loader.appendChild(quote)
  loader.appendChild(loading)

  screen.appendChild(loader)
}

const startMainFlow = async (screen) => {
  goToLoader(screen)

  await new Promise(resolve => setTimeout(resolve, 2500))

  goToYearMap(screen)
}

const getCurrentWeek = () => {
  const now = new Date()

  const startOfWeek = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - now.getDay()
  )

  return startOfWeek.getTime()
}

const resetStats = () => {
  const currentWeek = getCurrentWeek()
  if (currentWeek == statsCache.currentWeek()) {
    return
  }

  statsCache.clear(currentWeek)
}

const manualReset = async () => {
  const confirmed = confirm("You sure?")
  if (!confirmed) {
    return
  }

  const currentWeek = getCurrentWeek()
  statsCache.clear(currentWeek)
  userCache.clear()

  await reloadGame()
}

const reloadGame = async () => {
  const screen = document.getElementById("screen")

  goToSplash(screen)

  await new Promise(resolve => setTimeout(resolve, 1500))

  if (userCache.hasAge()) {
    await startMainFlow(screen)
  } else {
    goToAge(screen)
  }
}

window.onload = async () => {
  document.getElementById("reset").addEventListener("click", manualReset)

  resetStats()

  await reloadGame()
}
