// Beispiel-Skripte für die Landingpage (Vorschau). Fiktive Inhalte sind als solche gekennzeichnet.
import { mockScript } from '../../shared/mockScripts.js';

export function exampleScripts(lang) {
  const de = lang !== 'en';
  return {
    history: { ...mockScript({ niche: 'history', language: lang, episodeKey: 'cleopatra' }), style: 'cinematic', caption: 'karaoke' },
    facts: {
      title: de ? 'Venus-Fakt' : 'Venus fact', motif: 'city', style: 'anime', caption: 'pop',
      hook: de ? 'Auf der Venus dauert ein Tag länger als ein Jahr.' : 'On Venus, a day lasts longer than a year.',
      scenes: [
        { text: de ? 'Die Venus braucht rund 243 Erdtage für eine Drehung um sich selbst.' : 'Venus takes about 243 Earth days to spin once.' },
        { text: de ? 'Für eine Runde um die Sonne braucht sie nur etwa 225 Tage.' : 'One trip around the Sun takes only about 225 days.' },
      ],
      cta: de ? 'Folge für mehr Wissen in 30 Sekunden.' : 'Follow for more 30-second facts.',
    },
    motivation: {
      title: 'Start', motif: 'tower', style: 'realistic', caption: 'box',
      hook: de ? 'Du musst nicht motiviert sein, um anzufangen.' : 'You don’t need motivation to start.',
      scenes: [
        { text: de ? 'Motivation kommt oft erst, wenn du schon in Bewegung bist.' : 'Motivation often shows up once you are already moving.' },
        { text: de ? 'Nimm dir heute nur zwei Minuten. Mehr nicht.' : 'Give it just two minutes today. Nothing more.' },
      ],
      cta: de ? 'Speichere das für morgen früh.' : 'Save this for tomorrow morning.',
    },
    horror: {
      title: de ? 'Fiktive Gruselgeschichte' : 'Fictional horror story', motif: 'castle', style: 'comic', caption: 'classic',
      hook: de ? 'Um 3:07 Uhr klopfte es. Dreimal. Von innen.' : 'At 3:07 a.m. there was a knock. Three times. From the inside.',
      scenes: [
        { text: de ? 'Ich wohne allein. Der Schrank war leer, als ich schlafen ging.' : 'I live alone. The closet was empty when I went to bed.' },
        { text: de ? 'Am Morgen stand die Tür einen Spalt offen.' : 'In the morning, the door was open just a crack.' },
      ],
      cta: de ? 'Teil 2 morgen. Fiktive Geschichte.' : 'Part 2 tomorrow. Fictional story.',
    },
    reddit: {
      title: de ? 'Community-Story (fiktiv)' : 'Community story (fictional)', motif: 'city', style: 'stock', caption: 'minimal',
      hook: de ? 'Mein Mitbewohner hat ein Jahr lang meinen Joghurt gegessen.' : 'My roommate ate my yogurt for a whole year.',
      scenes: [
        { text: de ? 'Also habe ich angefangen, die Becher zu beschriften. Mit Hinweisen.' : 'So I started labelling the cups. With clues.' },
        { text: de ? 'Nach drei Wochen lag ein Zettel im Kühlschrank: Entschuldigung.' : 'After three weeks there was a note in the fridge: sorry.' },
      ],
      cta: de ? 'Fiktives Beispiel. Eigene Geschichten? Folge uns.' : 'Fictional example. Your own stories? Follow us.',
    },
  };
}
