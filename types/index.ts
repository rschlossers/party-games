import { Json } from './common';
import { AuthTables } from './auth';
import { NeverHaveIEverTables } from './games/never-have-i-ever';
import { EveryoneWhoStandsTables } from './games/everyone-who-stands';
import { BestStoryWinsTables } from './games/best-story-wins';
import { IShouldKnowThatTables } from './games/i-should-know-that';
import { IWishIDidntKnowThatTables } from './games/i-wish-i-didnt-know-that';
import { DrinkingGamesTables } from './games/drinking-games';
import { InteractionGamesTables } from './games/interaction-games';
import { QuestionGamesTables } from './games/question-games';
import { RelationshipGamesTables } from './games/relationship-games';
import { RandomThemeTables } from './games/random-theme';
import { BirthdayGreetingsTables } from './games/birthday-greetings';
import { TruthOrDareTables } from './games/truth-or-dare';
import { FuckMarryKillTables } from './games/fuck-marry-kill';

// Combine all table types into a single database type
export interface Database {
  public: {
    Tables: AuthTables & 
            NeverHaveIEverTables & 
            EveryoneWhoStandsTables & 
            BestStoryWinsTables & 
            IShouldKnowThatTables & 
            IWishIDidntKnowThatTables &
            DrinkingGamesTables &
            InteractionGamesTables &
            QuestionGamesTables &
            RelationshipGamesTables &
            RandomThemeTables &
            BirthdayGreetingsTables &
            TruthOrDareTables &
            FuckMarryKillTables
  }
}