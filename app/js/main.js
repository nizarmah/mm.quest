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
  set: (stat, count) => {
    localStorage.setItem(`stat:${stat.id}`, count || 0)
  },
  get: (stat) => {
    return localStorage.getItem(`stat:${stat.id}`) || 0
  },
  clear: () => {
    localStorage.clear()
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

  STATS.forEach((stat) => {
    const statNode = createStatNode(stat)
    screen.appendChild(statNode)
  })
}

window.onload = () => {
  const screen = document.getElementById("screen")

  goToStats(screen)
}
