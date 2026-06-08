// The 48 nations of FIFA World Cup 2026 (USA / Canada / Mexico).
//
// Factual fields (name, group, confederation) are cross-validated against the
// Dec 2025 final draw + openfootball/worldcup.json and are correct as of the
// June 2026 kickoff. Editorial fields (nickname, accent colors, underdogScore,
// playstyles, energy, heritageTags, rivals, stars) are authored for the
// assignment engine and the passport; refine star squads before launch.
//
// underdogScore: 0 = global juggernaut, 100 = pure debutant underdog.

import type { Nation } from './types'

export const NATIONS: Nation[] = [
  // ---- Group A ----
  {
    code: 'MEX', name: 'Mexico', flagEmoji: '🇲🇽', group: 'A',
    confederation: 'CONCACAF', region: 'north-america', nickname: 'El Tri',
    accent: { hue: 150, chroma: 0.15, lightness: 0.58 }, underdogScore: 35,
    playstyles: ['attacking', 'technical', 'flair'], energy: ['passionate', 'joyful'],
    heritageTags: ['mexico', 'central-america', 'north-america'], rivals: ['USA'],
    stars: ['Santiago Giménez', 'Edson Álvarez', 'Raúl Jiménez'],
  },
  {
    code: 'RSA', name: 'South Africa', flagEmoji: '🇿🇦', group: 'A',
    confederation: 'CAF', region: 'africa', nickname: 'Bafana Bafana',
    accent: { hue: 95, chroma: 0.15, lightness: 0.76 }, underdogScore: 76,
    playstyles: ['attacking', 'flair', 'direct'], energy: ['joyful', 'fearless'],
    heritageTags: ['southern-africa'], rivals: [],
    stars: ['Percy Tau', 'Ronwen Williams', 'Lyle Foster'],
  },
  {
    code: 'KOR', name: 'South Korea', flagEmoji: '🇰🇷', group: 'A',
    confederation: 'AFC', region: 'asia', nickname: 'Taegeuk Warriors',
    accent: { hue: 28, chroma: 0.17, lightness: 0.58 }, underdogScore: 54,
    playstyles: ['physical', 'counter', 'direct'], energy: ['gritty', 'fearless', 'disciplined'],
    heritageTags: ['east-asia'], rivals: ['JPN'],
    stars: ['Son Heung-min', 'Kim Min-jae', 'Lee Kang-in'],
  },
  {
    code: 'CZE', name: 'Czechia', flagEmoji: '🇨🇿', group: 'A',
    confederation: 'UEFA', region: 'europe', nickname: 'The Lions',
    accent: { hue: 255, chroma: 0.13, lightness: 0.52 }, underdogScore: 60,
    playstyles: ['technical', 'counter', 'defensive'], energy: ['disciplined', 'gritty'],
    heritageTags: ['eastern-europe'], rivals: [],
    stars: ['Patrik Schick', 'Tomáš Souček', 'Adam Hložek'],
  },

  // ---- Group B ----
  {
    code: 'CAN', name: 'Canada', flagEmoji: '🇨🇦', group: 'B',
    confederation: 'CONCACAF', region: 'north-america', nickname: 'Les Rouges',
    accent: { hue: 27, chroma: 0.18, lightness: 0.58 }, underdogScore: 68,
    playstyles: ['attacking', 'direct', 'physical'], energy: ['fearless', 'joyful'],
    heritageTags: ['north-america'], rivals: ['USA', 'MEX'],
    stars: ['Alphonso Davies', 'Jonathan David', 'Tajon Buchanan'],
  },
  {
    code: 'BIH', name: 'Bosnia & Herzegovina', flagEmoji: '🇧🇦', group: 'B',
    confederation: 'UEFA', region: 'europe', nickname: 'The Dragons',
    accent: { hue: 250, chroma: 0.14, lightness: 0.52 }, underdogScore: 78,
    playstyles: ['physical', 'direct', 'attacking'], energy: ['passionate', 'gritty'],
    heritageTags: ['balkans', 'eastern-europe'], rivals: [],
    stars: ['Edin Džeko', 'Sead Kolašinac', 'Amar Dedić'],
  },
  {
    code: 'QAT', name: 'Qatar', flagEmoji: '🇶🇦', group: 'B',
    confederation: 'AFC', region: 'middle-east', nickname: 'The Maroon',
    accent: { hue: 15, chroma: 0.13, lightness: 0.45 }, underdogScore: 80,
    playstyles: ['technical', 'counter', 'defensive'], energy: ['disciplined', 'cool'],
    heritageTags: ['arab', 'middle-east'], rivals: [],
    stars: ['Akram Afif', 'Almoez Ali', 'Hassan Al-Haydos'],
  },
  {
    code: 'SUI', name: 'Switzerland', flagEmoji: '🇨🇭', group: 'B',
    confederation: 'UEFA', region: 'europe', nickname: 'Nati',
    accent: { hue: 27, chroma: 0.2, lightness: 0.56 }, underdogScore: 44,
    playstyles: ['defensive', 'technical', 'counter'], energy: ['disciplined', 'cool'],
    heritageTags: ['western-europe'], rivals: [],
    stars: ['Granit Xhaka', 'Manuel Akanji', 'Breel Embolo'],
  },

  // ---- Group C ----
  {
    code: 'BRA', name: 'Brazil', flagEmoji: '🇧🇷', group: 'C',
    confederation: 'CONMEBOL', region: 'south-america', nickname: 'A Seleção',
    accent: { hue: 95, chroma: 0.17, lightness: 0.82 }, underdogScore: 5,
    playstyles: ['flair', 'attacking', 'technical', 'total-football'], energy: ['joyful', 'fearless'],
    heritageTags: ['brazil', 'south-america'], rivals: ['ARG'],
    stars: ['Vinícius Júnior', 'Rodrygo', 'Raphinha'],
  },
  {
    code: 'MAR', name: 'Morocco', flagEmoji: '🇲🇦', group: 'C',
    confederation: 'CAF', region: 'africa', nickname: 'The Atlas Lions',
    accent: { hue: 27, chroma: 0.18, lightness: 0.5 }, underdogScore: 50,
    playstyles: ['counter', 'defensive', 'physical', 'technical'], energy: ['gritty', 'passionate', 'fearless'],
    heritageTags: ['north-africa', 'arab'], rivals: ['ALG'],
    stars: ['Achraf Hakimi', 'Brahim Díaz', 'Youssef En-Nesyri'],
  },
  {
    code: 'HAI', name: 'Haiti', flagEmoji: '🇭🇹', group: 'C',
    confederation: 'CONCACAF', region: 'caribbean', nickname: 'Les Grenadiers',
    accent: { hue: 255, chroma: 0.15, lightness: 0.5 }, underdogScore: 92,
    playstyles: ['flair', 'direct', 'attacking'], energy: ['joyful', 'fearless', 'chaotic'],
    heritageTags: ['caribbean'], rivals: [],
    stars: ['Frantzdy Pierrot', 'Duckens Nazon', 'Danley Jean Jacques'],
  },
  {
    code: 'SCO', name: 'Scotland', flagEmoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'C',
    confederation: 'UEFA', region: 'europe', nickname: 'The Tartan Army',
    accent: { hue: 255, chroma: 0.12, lightness: 0.42 }, underdogScore: 68,
    playstyles: ['physical', 'direct', 'counter'], energy: ['passionate', 'gritty', 'fearless'],
    heritageTags: ['western-europe'], rivals: ['ENG'],
    stars: ['Andrew Robertson', 'Scott McTominay', 'John McGinn'],
  },

  // ---- Group D ----
  {
    code: 'USA', name: 'USA', flagEmoji: '🇺🇸', group: 'D',
    confederation: 'CONCACAF', region: 'north-america', nickname: 'The Stars and Stripes',
    accent: { hue: 250, chroma: 0.16, lightness: 0.45 }, underdogScore: 48,
    playstyles: ['physical', 'direct', 'counter', 'attacking'], energy: ['fearless', 'gritty'],
    heritageTags: ['north-america'], rivals: ['MEX'],
    stars: ['Christian Pulisic', 'Weston McKennie', 'Gio Reyna'],
  },
  {
    code: 'PAR', name: 'Paraguay', flagEmoji: '🇵🇾', group: 'D',
    confederation: 'CONMEBOL', region: 'south-america', nickname: 'La Albirroja',
    accent: { hue: 27, chroma: 0.18, lightness: 0.55 }, underdogScore: 72,
    playstyles: ['defensive', 'physical', 'counter'], energy: ['gritty', 'disciplined'],
    heritageTags: ['south-america'], rivals: [],
    stars: ['Miguel Almirón', 'Antonio Sanabria', 'Julio Enciso'],
  },
  {
    code: 'AUS', name: 'Australia', flagEmoji: '🇦🇺', group: 'D',
    confederation: 'AFC', region: 'oceania', nickname: 'The Socceroos',
    accent: { hue: 95, chroma: 0.16, lightness: 0.78 }, underdogScore: 65,
    playstyles: ['physical', 'direct', 'counter'], energy: ['gritty', 'fearless'],
    heritageTags: ['oceania'], rivals: [],
    stars: ['Mat Ryan', 'Riley McGree', 'Jackson Irvine'],
  },
  {
    code: 'TUR', name: 'Türkiye', flagEmoji: '🇹🇷', group: 'D',
    confederation: 'UEFA', region: 'europe', nickname: 'The Crescent-Stars',
    accent: { hue: 27, chroma: 0.2, lightness: 0.54 }, underdogScore: 55,
    playstyles: ['attacking', 'flair', 'physical'], energy: ['passionate', 'chaotic', 'fearless'],
    heritageTags: ['middle-east'], rivals: [],
    stars: ['Arda Güler', 'Hakan Çalhanoğlu', 'Kenan Yıldız'],
  },

  // ---- Group E ----
  {
    code: 'GER', name: 'Germany', flagEmoji: '🇩🇪', group: 'E',
    confederation: 'UEFA', region: 'europe', nickname: 'Die Mannschaft',
    accent: { hue: 92, chroma: 0.14, lightness: 0.76 }, underdogScore: 10,
    playstyles: ['technical', 'total-football', 'attacking'], energy: ['disciplined', 'cool'],
    heritageTags: ['western-europe'], rivals: ['NED'],
    stars: ['Jamal Musiala', 'Florian Wirtz', 'Kai Havertz'],
  },
  {
    code: 'CUW', name: 'Curaçao', flagEmoji: '🇨🇼', group: 'E',
    confederation: 'CONCACAF', region: 'caribbean', nickname: 'La Familia',
    accent: { hue: 240, chroma: 0.15, lightness: 0.5 }, underdogScore: 98,
    playstyles: ['flair', 'attacking', 'direct'], energy: ['joyful', 'fearless', 'chaotic'],
    heritageTags: ['caribbean'], rivals: [],
    stars: ['Leandro Bacuna', 'Juninho Bacuna', 'Tahith Chong'],
  },
  {
    code: 'CIV', name: 'Ivory Coast', flagEmoji: '🇨🇮', group: 'E',
    confederation: 'CAF', region: 'africa', nickname: 'Les Éléphants',
    accent: { hue: 55, chroma: 0.18, lightness: 0.65 }, underdogScore: 58,
    playstyles: ['physical', 'attacking', 'flair', 'direct'], energy: ['fearless', 'joyful', 'gritty'],
    heritageTags: ['west-africa'], rivals: [],
    stars: ['Franck Kessié', 'Sébastien Haller', 'Simon Adingra'],
  },
  {
    code: 'ECU', name: 'Ecuador', flagEmoji: '🇪🇨', group: 'E',
    confederation: 'CONMEBOL', region: 'south-america', nickname: 'La Tri',
    accent: { hue: 90, chroma: 0.16, lightness: 0.8 }, underdogScore: 68,
    playstyles: ['physical', 'counter', 'direct'], energy: ['gritty', 'fearless'],
    heritageTags: ['south-america'], rivals: [],
    stars: ['Moisés Caicedo', 'Enner Valencia', 'Pervis Estupiñán'],
  },

  // ---- Group F ----
  {
    code: 'NED', name: 'Netherlands', flagEmoji: '🇳🇱', group: 'F',
    confederation: 'UEFA', region: 'europe', nickname: 'Oranje',
    accent: { hue: 55, chroma: 0.2, lightness: 0.68 }, underdogScore: 15,
    playstyles: ['total-football', 'technical', 'attacking'], energy: ['cool', 'fearless'],
    heritageTags: ['western-europe'], rivals: ['GER'],
    stars: ['Virgil van Dijk', 'Cody Gakpo', 'Frenkie de Jong'],
  },
  {
    code: 'JPN', name: 'Japan', flagEmoji: '🇯🇵', group: 'F',
    confederation: 'AFC', region: 'asia', nickname: 'Samurai Blue',
    accent: { hue: 250, chroma: 0.15, lightness: 0.5 }, underdogScore: 45,
    playstyles: ['technical', 'attacking', 'total-football', 'counter'], energy: ['disciplined', 'fearless', 'joyful'],
    heritageTags: ['east-asia'], rivals: ['KOR'],
    stars: ['Takefusa Kubo', 'Kaoru Mitoma', 'Wataru Endō'],
  },
  {
    code: 'SWE', name: 'Sweden', flagEmoji: '🇸🇪', group: 'F',
    confederation: 'UEFA', region: 'europe', nickname: 'Blågult',
    accent: { hue: 95, chroma: 0.15, lightness: 0.82 }, underdogScore: 55,
    playstyles: ['physical', 'direct', 'counter'], energy: ['disciplined', 'gritty'],
    heritageTags: ['nordic'], rivals: [],
    stars: ['Alexander Isak', 'Viktor Gyökeres', 'Dejan Kulusevski'],
  },
  {
    code: 'TUN', name: 'Tunisia', flagEmoji: '🇹🇳', group: 'F',
    confederation: 'CAF', region: 'africa', nickname: 'Eagles of Carthage',
    accent: { hue: 27, chroma: 0.19, lightness: 0.52 }, underdogScore: 70,
    playstyles: ['defensive', 'counter', 'physical', 'technical'], energy: ['gritty', 'disciplined', 'passionate'],
    heritageTags: ['north-africa', 'arab'], rivals: [],
    stars: ['Hannibal Mejbri', 'Youssef Msakni', 'Montassar Talbi'],
  },

  // ---- Group G ----
  {
    code: 'BEL', name: 'Belgium', flagEmoji: '🇧🇪', group: 'G',
    confederation: 'UEFA', region: 'europe', nickname: 'The Red Devils',
    accent: { hue: 27, chroma: 0.2, lightness: 0.5 }, underdogScore: 25,
    playstyles: ['attacking', 'technical', 'counter'], energy: ['cool', 'fearless'],
    heritageTags: ['western-europe'], rivals: ['NED'],
    stars: ['Kevin De Bruyne', 'Jérémy Doku', 'Romelu Lukaku'],
  },
  {
    code: 'EGY', name: 'Egypt', flagEmoji: '🇪🇬', group: 'G',
    confederation: 'CAF', region: 'africa', nickname: 'The Pharaohs',
    accent: { hue: 27, chroma: 0.18, lightness: 0.55 }, underdogScore: 62,
    playstyles: ['counter', 'technical', 'physical'], energy: ['passionate', 'gritty'],
    heritageTags: ['north-africa', 'arab'], rivals: [],
    stars: ['Mohamed Salah', 'Omar Marmoush', 'Mohamed Elneny'],
  },
  {
    code: 'IRN', name: 'Iran', flagEmoji: '🇮🇷', group: 'G',
    confederation: 'AFC', region: 'middle-east', nickname: 'Team Melli',
    accent: { hue: 150, chroma: 0.14, lightness: 0.55 }, underdogScore: 60,
    playstyles: ['defensive', 'physical', 'counter'], energy: ['disciplined', 'gritty', 'passionate'],
    heritageTags: ['middle-east'], rivals: [],
    stars: ['Mehdi Taremi', 'Alireza Jahanbakhsh', 'Sardar Azmoun'],
  },
  {
    code: 'NZL', name: 'New Zealand', flagEmoji: '🇳🇿', group: 'G',
    confederation: 'OFC', region: 'oceania', nickname: 'All Whites',
    accent: { hue: 255, chroma: 0.04, lightness: 0.5 }, underdogScore: 90,
    playstyles: ['physical', 'direct', 'defensive'], energy: ['gritty', 'fearless'],
    heritageTags: ['oceania'], rivals: [],
    stars: ['Chris Wood', 'Marko Stamenić', 'Liberato Cacace'],
  },

  // ---- Group H ----
  {
    code: 'ESP', name: 'Spain', flagEmoji: '🇪🇸', group: 'H',
    confederation: 'UEFA', region: 'europe', nickname: 'La Roja',
    accent: { hue: 27, chroma: 0.2, lightness: 0.55 }, underdogScore: 12,
    playstyles: ['technical', 'total-football', 'attacking', 'flair'], energy: ['cool', 'joyful'],
    heritageTags: ['southern-europe'], rivals: ['POR'],
    stars: ['Lamine Yamal', 'Pedri', 'Nico Williams'],
  },
  {
    code: 'CPV', name: 'Cape Verde', flagEmoji: '🇨🇻', group: 'H',
    confederation: 'CAF', region: 'africa', nickname: 'The Blue Sharks',
    accent: { hue: 240, chroma: 0.15, lightness: 0.48 }, underdogScore: 96,
    playstyles: ['flair', 'attacking', 'direct'], energy: ['joyful', 'fearless', 'chaotic'],
    heritageTags: ['west-africa'], rivals: [],
    stars: ['Ryan Mendes', 'Garry Rodrigues', 'Jamiro Monteiro'],
  },
  {
    code: 'KSA', name: 'Saudi Arabia', flagEmoji: '🇸🇦', group: 'H',
    confederation: 'AFC', region: 'middle-east', nickname: 'The Green Falcons',
    accent: { hue: 152, chroma: 0.15, lightness: 0.55 }, underdogScore: 72,
    playstyles: ['technical', 'counter', 'attacking'], energy: ['passionate', 'fearless'],
    heritageTags: ['arab', 'middle-east'], rivals: [],
    stars: ['Salem Al-Dawsari', 'Firas Al-Buraikan', 'Mohamed Kanno'],
  },
  {
    code: 'URU', name: 'Uruguay', flagEmoji: '🇺🇾', group: 'H',
    confederation: 'CONMEBOL', region: 'south-america', nickname: 'La Celeste',
    accent: { hue: 230, chroma: 0.12, lightness: 0.62 }, underdogScore: 38,
    playstyles: ['physical', 'counter', 'technical'], energy: ['gritty', 'passionate', 'fearless'],
    heritageTags: ['south-america'], rivals: ['ARG', 'BRA'],
    stars: ['Federico Valverde', 'Darwin Núñez', 'Ronald Araújo'],
  },

  // ---- Group I ----
  {
    code: 'FRA', name: 'France', flagEmoji: '🇫🇷', group: 'I',
    confederation: 'UEFA', region: 'europe', nickname: 'Les Bleus',
    accent: { hue: 258, chroma: 0.16, lightness: 0.45 }, underdogScore: 8,
    playstyles: ['counter', 'technical', 'attacking', 'physical'], energy: ['cool', 'fearless'],
    heritageTags: ['western-europe'], rivals: [],
    stars: ['Kylian Mbappé', 'Aurélien Tchouaméni', 'Ousmane Dembélé'],
  },
  {
    code: 'SEN', name: 'Senegal', flagEmoji: '🇸🇳', group: 'I',
    confederation: 'CAF', region: 'africa', nickname: 'Lions of Teranga',
    accent: { hue: 150, chroma: 0.15, lightness: 0.55 }, underdogScore: 50,
    playstyles: ['physical', 'attacking', 'direct', 'counter'], energy: ['fearless', 'passionate', 'joyful'],
    heritageTags: ['west-africa'], rivals: [],
    stars: ['Sadio Mané', 'Nicolas Jackson', 'Pape Matar Sarr'],
  },
  {
    code: 'IRQ', name: 'Iraq', flagEmoji: '🇮🇶', group: 'I',
    confederation: 'AFC', region: 'middle-east', nickname: 'Lions of Mesopotamia',
    accent: { hue: 150, chroma: 0.13, lightness: 0.5 }, underdogScore: 85,
    playstyles: ['counter', 'physical', 'defensive'], energy: ['passionate', 'gritty', 'fearless'],
    heritageTags: ['arab', 'middle-east'], rivals: [],
    stars: ['Aymen Hussein', 'Zidane Iqbal', 'Ali Jasim'],
  },
  {
    code: 'NOR', name: 'Norway', flagEmoji: '🇳🇴', group: 'I',
    confederation: 'UEFA', region: 'europe', nickname: 'Løvene',
    accent: { hue: 25, chroma: 0.18, lightness: 0.52 }, underdogScore: 52,
    playstyles: ['direct', 'physical', 'counter', 'attacking'], energy: ['fearless', 'cool', 'gritty'],
    heritageTags: ['nordic'], rivals: [],
    stars: ['Erling Haaland', 'Martin Ødegaard', 'Alexander Sørloth'],
  },

  // ---- Group J ----
  {
    code: 'ARG', name: 'Argentina', flagEmoji: '🇦🇷', group: 'J',
    confederation: 'CONMEBOL', region: 'south-america', nickname: 'La Albiceleste',
    accent: { hue: 230, chroma: 0.13, lightness: 0.68 }, underdogScore: 5,
    playstyles: ['technical', 'flair', 'attacking', 'counter'], energy: ['passionate', 'fearless', 'romantic'],
    heritageTags: ['south-america'], rivals: ['BRA'],
    stars: ['Lionel Messi', 'Lautaro Martínez', 'Julián Álvarez'],
  },
  {
    code: 'ALG', name: 'Algeria', flagEmoji: '🇩🇿', group: 'J',
    confederation: 'CAF', region: 'africa', nickname: 'Les Fennecs',
    accent: { hue: 152, chroma: 0.15, lightness: 0.55 }, underdogScore: 62,
    playstyles: ['technical', 'flair', 'attacking', 'counter'], energy: ['passionate', 'fearless'],
    heritageTags: ['north-africa', 'arab'], rivals: ['MAR'],
    stars: ['Riyad Mahrez', 'Houssem Aouar', 'Amine Gouiri'],
  },
  {
    code: 'AUT', name: 'Austria', flagEmoji: '🇦🇹', group: 'J',
    confederation: 'UEFA', region: 'europe', nickname: 'Das Team',
    accent: { hue: 27, chroma: 0.2, lightness: 0.55 }, underdogScore: 58,
    playstyles: ['physical', 'direct', 'counter', 'total-football'], energy: ['disciplined', 'gritty'],
    heritageTags: ['western-europe'], rivals: ['GER'],
    stars: ['David Alaba', 'Marko Arnautović', 'Konrad Laimer'],
  },
  {
    code: 'JOR', name: 'Jordan', flagEmoji: '🇯🇴', group: 'J',
    confederation: 'AFC', region: 'middle-east', nickname: 'Al-Nashama',
    accent: { hue: 25, chroma: 0.16, lightness: 0.5 }, underdogScore: 88,
    playstyles: ['counter', 'defensive', 'physical'], energy: ['fearless', 'gritty', 'passionate'],
    heritageTags: ['arab', 'middle-east'], rivals: [],
    stars: ['Mousa Al-Tamari', 'Yazan Al-Naimat', 'Nizar Al-Rashdan'],
  },

  // ---- Group K ----
  {
    code: 'POR', name: 'Portugal', flagEmoji: '🇵🇹', group: 'K',
    confederation: 'UEFA', region: 'europe', nickname: 'Seleção das Quinas',
    accent: { hue: 27, chroma: 0.2, lightness: 0.5 }, underdogScore: 14,
    playstyles: ['flair', 'technical', 'attacking', 'counter'], energy: ['passionate', 'fearless', 'romantic'],
    heritageTags: ['southern-europe'], rivals: ['ESP'],
    stars: ['Cristiano Ronaldo', 'Bruno Fernandes', 'Rafael Leão'],
  },
  {
    code: 'COD', name: 'DR Congo', flagEmoji: '🇨🇩', group: 'K',
    confederation: 'CAF', region: 'africa', nickname: 'Les Léopards',
    accent: { hue: 230, chroma: 0.14, lightness: 0.6 }, underdogScore: 80,
    playstyles: ['physical', 'attacking', 'direct', 'flair'], energy: ['fearless', 'joyful', 'chaotic'],
    heritageTags: ['central-africa'], rivals: [],
    stars: ['Cédric Bakambu', 'Chancel Mbemba', 'Yoane Wissa'],
  },
  {
    code: 'UZB', name: 'Uzbekistan', flagEmoji: '🇺🇿', group: 'K',
    confederation: 'AFC', region: 'asia', nickname: 'The White Wolves',
    accent: { hue: 235, chroma: 0.13, lightness: 0.55 }, underdogScore: 90,
    playstyles: ['technical', 'counter', 'physical'], energy: ['fearless', 'disciplined'],
    heritageTags: ['central-asia'], rivals: [],
    stars: ['Eldor Shomurodov', 'Abbosbek Fayzullaev', 'Khusniddin Alikulov'],
  },
  {
    code: 'COL', name: 'Colombia', flagEmoji: '🇨🇴', group: 'K',
    confederation: 'CONMEBOL', region: 'south-america', nickname: 'Los Cafeteros',
    accent: { hue: 92, chroma: 0.17, lightness: 0.82 }, underdogScore: 40,
    playstyles: ['flair', 'technical', 'attacking'], energy: ['joyful', 'passionate', 'fearless'],
    heritageTags: ['south-america'], rivals: [],
    stars: ['Luis Díaz', 'James Rodríguez', 'Jhon Durán'],
  },

  // ---- Group L ----
  {
    code: 'ENG', name: 'England', flagEmoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'L',
    confederation: 'UEFA', region: 'europe', nickname: 'The Three Lions',
    accent: { hue: 27, chroma: 0.18, lightness: 0.55 }, underdogScore: 12,
    playstyles: ['direct', 'physical', 'attacking', 'counter'], energy: ['passionate', 'fearless'],
    heritageTags: ['western-europe'], rivals: ['SCO'],
    stars: ['Jude Bellingham', 'Harry Kane', 'Bukayo Saka'],
  },
  {
    code: 'CRO', name: 'Croatia', flagEmoji: '🇭🇷', group: 'L',
    confederation: 'UEFA', region: 'europe', nickname: 'Vatreni',
    accent: { hue: 28, chroma: 0.2, lightness: 0.55 }, underdogScore: 42,
    playstyles: ['technical', 'total-football', 'counter'], energy: ['passionate', 'gritty', 'romantic'],
    heritageTags: ['balkans', 'eastern-europe'], rivals: [],
    stars: ['Luka Modrić', 'Joško Gvardiol', 'Mateo Kovačić'],
  },
  {
    code: 'GHA', name: 'Ghana', flagEmoji: '🇬🇭', group: 'L',
    confederation: 'CAF', region: 'africa', nickname: 'The Black Stars',
    accent: { hue: 92, chroma: 0.15, lightness: 0.78 }, underdogScore: 62,
    playstyles: ['physical', 'attacking', 'direct', 'flair'], energy: ['fearless', 'joyful', 'gritty'],
    heritageTags: ['west-africa'], rivals: [],
    stars: ['Mohammed Kudus', 'Thomas Partey', 'Iñaki Williams'],
  },
  {
    code: 'PAN', name: 'Panama', flagEmoji: '🇵🇦', group: 'L',
    confederation: 'CONCACAF', region: 'north-america', nickname: 'La Marea Roja',
    accent: { hue: 27, chroma: 0.18, lightness: 0.5 }, underdogScore: 82,
    playstyles: ['physical', 'direct', 'counter'], energy: ['fearless', 'gritty', 'joyful'],
    heritageTags: ['central-america'], rivals: [],
    stars: ['Adalberto Carrasquilla', 'Michael Murillo', 'José Fajardo'],
  },
]

/** Fast lookup by code. */
export const NATION_BY_CODE: Record<string, Nation> = Object.fromEntries(
  NATIONS.map((n) => [n.code, n]),
)

/** All group ids present, sorted. */
export const GROUP_IDS = [...new Set(NATIONS.map((n) => n.group))].sort()
