import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { IconProps } from '@expo/vector-icons/build/createIconSet';

// Type for game configuration
export interface GameConfig {
  id: string;
  path: string;
  titleKey: string;     // Used for both title display and visibility toggle in settings
  descriptionKey: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  enabled: boolean;
  dashboard?: 'party' | 'funStuff' | 'partyTools'; // Which dashboard the game belongs to
}

// Central registry of all games in the app
export const GAMES: GameConfig[] = [
  {
    id: 'never-have-i-ever',
    path: 'never-have-i-ever',
    titleKey: 'neverHaveIEver.title',
    descriptionKey: 'neverHaveIEver.description',
    icon: 'cards-playing-outline',
    enabled: true,
    dashboard: 'party'
  },
  {
    id: 'everyone-who-stands',
    path: 'everyone-who-stands',
    titleKey: 'everyoneWhoStands.title',
    descriptionKey: 'everyoneWhoStands.description',
    icon: 'account-group-outline',
    enabled: true,
    dashboard: 'party'
  },
  {
    id: 'best-story-wins',
    path: 'best-story-wins',
    titleKey: 'bestStoryWins.title',
    descriptionKey: 'bestStoryWins.description',
    icon: 'book-open-variant',
    enabled: true,
    dashboard: 'party'
  },
  {
    id: 'i-should-know-that',
    path: 'i-should-know-that', 
    titleKey: 'iShouldKnowThat.title',
    descriptionKey: 'iShouldKnowThat.description',
    icon: 'brain',
    enabled: true,
    dashboard: 'party'
  },
  {
    id: 'i-wish-i-didnt-know-that',
    path: 'i-wish-i-didnt-know-that',
    titleKey: 'iWishIDidntKnowThat.title', 
    descriptionKey: 'iWishIDidntKnowThat.description',
    icon: 'thought-bubble-outline',
    enabled: true,
    dashboard: 'party'
  },
  {
    id: 'you-laugh-you-drink',
    path: 'you-laugh-you-drink',
    titleKey: 'youLaughYouDrink.title',
    descriptionKey: 'youLaughYouDrink.description', 
    icon: 'glass-wine',
    enabled: true,
    dashboard: 'party'
  },
  {
    id: 'you-lie-you-drink',
    path: 'you-lie-you-drink',
    titleKey: 'youLieYouDrink.title',
    descriptionKey: 'youLieYouDrink.description', 
    icon: 'glass-cocktail',
    enabled: true,
    dashboard: 'party'
  },
  {
    id: 'charades',
    path: 'charades',
    titleKey: 'charades.title',
    descriptionKey: 'charades.description', 
    icon: 'drama-masks',
    enabled: true,
    dashboard: 'party'
  },
  {
    id: 'whats-your-number',
    path: 'whats-your-number',
    titleKey: 'whatsYourNumber.title',
    descriptionKey: 'whatsYourNumber.description',
    icon: 'percent-outline',
    enabled: true,
    dashboard: 'party'
  },
  {
    id: 'would-you-rather',
    path: 'would-you-rather',
    titleKey: 'wouldYouRather.title',
    descriptionKey: 'wouldYouRather.description',
    icon: 'help-circle-outline',
    enabled: true,
    dashboard: 'party'
  },
  {
    id: 'who-in-the-room',
    path: 'who-in-the-room',
    titleKey: 'whoInTheRoom.title',
    descriptionKey: 'whoInTheRoom.description',
    icon: 'account-search-outline',
    enabled: true,
    dashboard: 'party'
  },
  {
    id: 'impressions',
    path: 'impressions',
    titleKey: 'impressions.title',
    descriptionKey: 'impressions.description',
    icon: 'account-voice',
    enabled: true,
    dashboard: 'party'
  },
  {
    id: 'back-to-back',
    path: 'back-to-back',
    titleKey: 'backToBack.title',
    descriptionKey: 'backToBack.description',
    icon: 'human-male-female',
    enabled: true,
    dashboard: 'party'
  },
  {
    id: 'bad-movie-plots',
    path: 'bad-movie-plots',
    titleKey: 'badMoviePlots.title',
    descriptionKey: 'badMoviePlots.description',
    icon: 'movie-open',
    enabled: true,
    dashboard: 'party'
  },
  {
    id: 'taskmaster',
    path: 'taskmaster',
    titleKey: 'taskmaster.title',
    descriptionKey: 'taskmaster.description',
    icon: 'trophy-outline',
    enabled: true,
    dashboard: 'party'
  },
  {
    id: 'pictionary',
    path: 'pictionary',
    titleKey: 'pictionary.title',
    descriptionKey: 'pictionary.description',
    icon: 'draw',
    enabled: true,
    dashboard: 'party'
  },
  {
    id: 'date-ideas',
    path: 'date-ideas',
    titleKey: 'dateIdeas.title',
    descriptionKey: 'dateIdeas.description',
    icon: 'heart-outline',
    enabled: true,
    dashboard: 'funStuff'
  },
  {
    id: 'pickup-lines',
    path: 'pickup-lines',
    titleKey: 'pickupLines.title',
    descriptionKey: 'pickupLines.description',
    icon: 'heart-multiple-outline',
    enabled: true,
    dashboard: 'funStuff'
  },
  {
    id: 'joke-generator',
    path: 'joke-generator',
    titleKey: 'jokeGenerator.title',
    descriptionKey: 'jokeGenerator.description',
    icon: 'emoticon-wink-outline',
    enabled: true,
    dashboard: 'funStuff'
  },
  {
    id: 'random-theme',
    path: 'random-theme',
    titleKey: 'randomTheme.title',
    descriptionKey: 'randomTheme.description',
    icon: 'party-popper',
    enabled: true,
    dashboard: 'funStuff'
  },
  {
    id: 'birthday-greetings',
    path: 'birthday-greetings',
    titleKey: 'birthdayGreetings.title',
    descriptionKey: 'birthdayGreetings.description',
    icon: 'cake-variant',
    enabled: true,
    dashboard: 'funStuff'
  },
  {
    id: 'random-letter',
    path: 'random-letter',
    titleKey: 'randomLetter.title',
    descriptionKey: 'randomLetter.description',
    icon: 'alphabetical-variant',
    enabled: true,
    dashboard: 'partyTools'
  },
  {
    id: 'random-number',
    path: 'random-number',
    titleKey: 'randomNumber.title',
    descriptionKey: 'randomNumber.description',
    icon: 'numeric',
    enabled: true,
    dashboard: 'partyTools'
  },
  {
    id: 'countdown',
    path: 'countdown',
    titleKey: 'countdown.title',
    descriptionKey: 'countdown.description',
    icon: 'timer-outline',
    enabled: true,
    dashboard: 'partyTools'
  },
  {
    id: 'stopwatch',
    path: 'stopwatch',
    titleKey: 'stopwatch.title',
    descriptionKey: 'stopwatch.description',
    icon: 'timer-sand',
    enabled: true,
    dashboard: 'partyTools'
  },
  {
    id: 'dice',
    path: 'dice',
    titleKey: 'dice.title',
    descriptionKey: 'dice.description',
    icon: 'dice-multiple',
    enabled: true,
    dashboard: 'partyTools'
  },
  {
    id: 'rock-paper-scissors',
    path: 'rock-paper-scissors',
    titleKey: 'rockPaperScissors.title',
    descriptionKey: 'rockPaperScissors.description',
    icon: 'gesture-tap-hold',
    enabled: true,
    dashboard: 'partyTools'
  },
  {
    id: 'heads-or-tails',
    path: 'heads-or-tails',
    titleKey: 'headsOrTails.title',
    descriptionKey: 'headsOrTails.description',
    icon: 'cash-multiple',
    enabled: true,
    dashboard: 'partyTools'
  },
  {
    id: 'do-or-drink',
    path: 'do-or-drink',
    titleKey: 'doOrDrink.title',
    descriptionKey: 'doOrDrink.description',
    icon: 'glass-cocktail',
    enabled: true,
    dashboard: 'party'
  },
  {
    id: 'say-the-same-thing',
    path: 'say-the-same-thing',
    titleKey: 'sayTheSameThing.title',
    descriptionKey: 'sayTheSameThing.description',
    icon: 'message-text',
    enabled: true,
    dashboard: 'party'
  },
  {
    id: 'truth-or-dare',
    path: 'truth-or-dare',
    titleKey: 'truthOrDare.title',
    descriptionKey: 'truthOrDare.description',
    icon: 'theater',
    enabled: true,
    dashboard: 'party'
  },
  {
    id: 'spin-the-bottle',
    path: 'spin-the-bottle',
    titleKey: 'spinTheBottle.title',
    descriptionKey: 'spinTheBottle.description',
    icon: 'bottle-wine',
    enabled: true,
    dashboard: 'partyTools'
  },
  {
    id: 'wheel-of-fortune',
    path: 'wheel-of-fortune',
    titleKey: 'wheelOfFortune.title',
    descriptionKey: 'wheelOfFortune.description',
    icon: 'wheel-barrow',
    enabled: true,
    dashboard: 'partyTools'
  },
  {
    id: 'blood-alcohol-calculator',
    path: 'blood-alcohol-calculator',
    titleKey: 'bloodAlcoholCalculator.title',
    descriptionKey: 'bloodAlcoholCalculator.description',
    icon: 'beer',
    enabled: true,
    dashboard: 'partyTools'
  },
  {
    id: 'team-generator',
    path: 'team-generator',
    titleKey: 'teamGenerator.title',
    descriptionKey: 'teamGenerator.description',
    icon: 'account-group',
    enabled: true,
    dashboard: 'partyTools'
  },
  {
    id: 'photo- challenges',
    path: 'photo-challenges',
    titleKey: 'photoChallenges.title',
    descriptionKey: 'photoChallenges.description',
    icon: 'camera',
    enabled: true,
    dashboard: 'party'
  },
  {
    id: 'scoreboard',
    path: 'scoreboard',
    titleKey: 'scoreboard.title',
    descriptionKey: 'scoreboard.description',
    icon: 'scoreboard',
    enabled: true,
    dashboard: 'partyTools'
  },
  {
    id: 'video-challenges',
    path: 'video-challenges',
    titleKey: 'videoChallenges.title',
    descriptionKey: 'videoChallenges.description',
    icon: 'video',
    enabled: true,
    dashboard: 'party'
  },
  {
    id: 'true-or-bullshit',
    path: 'true-or-bullshit',
    titleKey: 'trueOrBullshit.title',
    descriptionKey: 'trueOrBullshit.description',
    icon: 'help-circle-outline',
    enabled: true,
    dashboard: 'party'
  },
  {
    id: 'fuck-marry-kill',
    path: 'fuck-marry-kill',
    titleKey: 'fuckMarryKill.title',
    descriptionKey: 'fuckMarryKill.description',
    icon: 'heart-broken',
    enabled: true,
    dashboard: 'party'
  }
];