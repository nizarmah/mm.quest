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
  const startOfNextYear = new Date(year + 1, 0, 1)
  const msPerDay = 24 * 60 * 60 * 1000
  const todayIndex = Math.floor((now - startOfYear) / msPerDay)

  let index = 0
  for (let time = startOfYear.getTime(); time < startOfNextYear.getTime(); time += msPerDay) {
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
    index++
  }

  screen.appendChild(yearMap)
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

  await reloadGame()
}

const reloadGame = async () => {
  const screen = document.getElementById("screen")

  goToSplash(screen)

  await new Promise(resolve => setTimeout(resolve, 1500))

  goToLoader(screen)

  await new Promise(resolve => setTimeout(resolve, 2500))

  goToStats(screen)
}

window.onload = async () => {
  document.getElementById("reset").addEventListener("click", manualReset)

  resetStats()

  await reloadGame()
}
