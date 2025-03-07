import { TranslationMap } from '../types';

/**
 * English translations - serves as the fallback
 */
export const enTranslations: TranslationMap = {
  dashboard: {
    title: 'Hyg.dk Party Games',
    description: 'Choose one of our game categories to get started',
    footer: '© 2025 Hyg.dk',
    word: 'Dashboard'
  },
  index: {
    page: 'Party Games',
    comingSoon: 'Coming Soon',
    moreGames: 'More games',
    description: 'Fun and entertaining party games to liven up any gathering'
  },
  funStuff: {
    title: 'Fun Stuff',
    description: 'Creative and entertaining activities to spice up your gatherings'
  },
  partyTools: {
    title: 'Party Tools',
    description: 'Useful tools to help organize and enhance your party experience'
  },
  drinkingGames: {
    title: 'Drinking Games',
    description: 'Discover classic and modern drinking games with detailed instructions and variations',
    searchPlaceholder: 'Search drinking games...',
    filters: 'Filters',
    clearFilters: 'Clear All',
    type: 'Game Type',
    country: 'Country',
    materials: 'Materials',
    loading: 'Loading games...',
    fetchError: 'Failed to load drinking games',
    gameNotFound: 'Game not found',
    contents: 'Contents',
    introduction: 'Introduction',
    howToPlay: 'How to Play',
    variations: 'Variations',
    strategyAndTips: 'Strategy & Tips',
    bestDrinks: 'Best Drinks',
    history: 'History',
    relatedGames: 'Similar Games'
  },
  randomLetter: {
    title: 'Random Letter Generator',
    description: 'Generate random letters for games, icebreakers, and more',
    generate: 'Generate Letter',
    result: 'Your random letter is shown above.',
    resultDanish: 'Your random letter includes Danish special characters (Æ, Ø, Å).',
    resultSwedish: 'Your random letter includes Swedish special characters (Å, Ä, Ö).',
    resultNorwegian: 'Your random letter includes Norwegian special characters (Æ, Ø, Å).',
    specialCharacters: {
      danish: 'Your random letter includes Danish special characters (Æ, Ø, Å).',
      swedish: 'Your random letter includes Swedish special characters (Å, Ä, Ö).',
      norwegian: 'Your random letter includes Norwegian special characters (Æ, Ø, Å).'
    }
  },
  randomNumber: {
    title: 'Random Number Generator',
    description: 'Generate random numbers within your chosen range',
    generate: 'Generate Number',
    result: 'Your random number is shown above',
    minLabel: 'Minimum',
    maxLabel: 'Maximum',
    defaultRange: '1-10',
    customRange: 'Custom Range',
    invalidRange: 'Maximum must be greater than minimum'
  },
  dice: {
    title: 'Dice Roller',
    description: 'Roll virtual dice for board games, RPGs, or any game that needs dice',
    roll: 'Roll Dice',
    reset: 'Reset',
    total: 'Total:',
    numberOfDice: 'Number of Dice',
    lockInstructions: 'Tap on dice to lock/unlock them between rolls'
  },
  rockPaperScissors: {
    title: 'Rock Paper Scissors',
    description: 'Generate a random choice for Rock Paper Scissors games or decision making',
    generate: 'Generate Choice',
    reset: 'Reset',
    standard: 'Classic Mode',
    extended: 'Big Bang Mode',
    result: 'Your random choice will appear here',
    availableOptions: 'Available Options',
    rock: 'Rock',
    paper: 'Paper',
    scissors: 'Scissors',
    lizard: 'Lizard',
    spock: 'Spock'
  },
  headsOrTails: {
    title: 'Heads or Tails',
    description: 'Flip a virtual coin to make decisions or settle disputes',
    flipCoin: 'Flip Coin',
    heads: 'Heads',
    tails: 'Tails',
    tapToFlip: 'Tap to flip',
    funFact: {
      title: 'Fun Fact',
      text: 'The odds of flipping heads are not exactly 50/50 due to the weight distribution and design of most coins.'
    }
  },
  spinTheBottle: {
    title: 'Spin the Bottle',
    description: 'A classic party game where a bottle is spun to randomly select someone',
    spin: 'Spin Bottle',
    spinAgain: 'Spin Again',
    tapToSpin: 'Tap the button to spin the bottle',
    spinningInstructions: 'The bottle will stop randomly'
  },
  bloodAlcoholCalculator: {
    title: 'Blood Alcohol Calculator',
    description: 'Calculate your estimated blood alcohol content (BAC) based on your drinks, weight, and gender',
    drinksTitle: 'Number of Drinks',
    beer: 'Beer',
    strongBeer: 'Strong Beer',
    wine: 'Glass of Wine',
    spirits: 'Spirits',
    standardDrinks: 'Standard Drinks',
    personalInfoTitle: 'About You',
    drinkingDuration: 'How long have you been drinking? (hours)',
    weight: 'Your weight',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    calculate: 'Calculate',
    resultsTitle: 'Your Result',
    yourBAC: 'Your BAC is',
    timeToSober: 'Time until sober',
    hours: 'hours and',
    minutes: 'minutes',
    youAreSober: 'You should be sober now',
    calories: 'You have consumed approximately',
    runningDistance: 'You need to run approximately',
    disclaimer: 'This calculation is for guidance only!'
  },
  dateIdeas: {
    title: 'Date Ideas',
    description: 'Find inspiration for creative dates with this alphabetical list of date ideas',
    categories: {
      title: 'Select Category'
    },
    startGame: 'Find Ideas',
    next: 'Next Idea'
  },
  pickupLines: {
    title: 'Pick Up Lines',
    description: 'Discover funny, creative, and cheesy pick up lines for every occasion',
    categories: {
      title: 'Select Category'
    },
    findLine: 'Find Pickup Line',
    next: 'Next Pickup Line'
  },
  jokeGenerator: {
    title: 'Joke Generator',
    description: 'Find hilarious jokes for any situation to make everyone laugh',
    categories: {
      title: 'Select Category'
    },
    findJokes: 'Find Jokes',
    nextJoke: 'Next Joke'
  },
  randomTheme: {
    title: 'Random Theme',
    description: 'Get a random theme idea for your next theme party',
    categories: {
      title: 'Select Category'
    },
    findThemes: 'Find Themes',
    nextTheme: 'Next Theme'
  },
  birthdayGreetings: {
    title: 'Birthday Greetings',
    description: 'Find the perfect birthday wishes to write in cards for friends and family',
    categories: {
      title: 'Select Category'
    },
    findGreetings: 'Find Greetings',
    nextGreeting: 'Next Greeting'
  },
  truthOrDare: {
    title: 'Truth or Dare',
    description: 'Take turns choosing truth or dare in this classic party game',
    truth: 'Truth',
    dare: 'Dare',
    selectTruth: 'Random Truth',
    selectDare: 'Random Dare',
    instructions: 'Click one of the buttons to get either a truth or a dare',
    categories: {
      truthTitle: 'Select Truth Category',
      dareTitle: 'Select Dare Category'
    }
  },
  stopwatch: {
    title: 'Stopwatch',
    description: 'Track time with precision for games, competitions, and party activities',
    start: 'Start',
    stop: 'Stop',
    reset: 'Reset',
    lap: 'Lap',
    lapTimes: 'Lap Times',
    totalTime: 'Total Time',
    noLaps: 'No laps recorded yet',
    lapNumber: 'Lap'
  },
  countdown: {
    title: 'Countdown Timer',
    description: 'Set a countdown timer with custom alarm sound',
    start: 'Start',
    pause: 'Pause',
    resume: 'Resume',
    reset: 'Reset',
    timeUp: 'Time\'s Up!',
    hoursLabel: 'Hours',
    minutesLabel: 'Minutes',
    secondsLabel: 'Seconds'
  },
  game: {
    selectCategory: 'Select a category',
    startGame: 'Start Game',
    next: 'Next Statement',
    noStatements: 'No statements available',
    loadingMore: 'Loading more...',
    loading: 'Loading...',
    retrying: 'Retrying... (Attempt %{count})',
    fetchError: 'Failed to connect to server. Please check your connection and try again.'
  },
  settings: {
    title: 'Settings',
    language: 'Language',
    theme: 'Theme',
    gameVisibility: {
      title: 'Game Visibility',
      description: 'Show or hide games from the main menu',
      neverHaveIEver: 'Never Have I Ever'
    }
  },
  scoreboard: {
    title: 'Scoreboard',
    description: 'Keep track of scores for any game with this universal scoreboard',
    newBoardPlaceholder: 'Enter scoreboard name...',
    create: 'Create Scoreboard',
    newPlayerPlaceholder: 'Enter player name...',
    addPlayer: 'Add Player',
    players: '%{count} players',
    back: 'Back to Scoreboards',
    round: 'Round %{number}',
    newRound: 'New Round',
    reset: 'Reset',
    errorLoading: 'Failed to load scoreboards',
    errorEmptyName: 'Please enter a name',
    errorEmptyPlayerName: 'Please enter a player name'
  }
};

export { enTranslations }