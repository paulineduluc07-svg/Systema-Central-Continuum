export type TarotCard = {
  id: number;
  name: string;
  nameFr: string;
  arcana: "major" | "minor";
  suit?: "wands" | "cups" | "swords" | "pentacles";
  number: number;
  keywords: string[];
  upright: string;
  reversed: string;
  symbol: string; // SVG symbol key
};

export const MAJOR_ARCANA: TarotCard[] = [
  {
    id: 0,
    name: "The Fool",
    nameFr: "Le Mat",
    arcana: "major",
    number: 0,
    keywords: ["nouveaux commencements", "insouciance", "aventure", "liberté", "idéalisme"],
    upright:
      "Le Mat annonce un nouveau départ plein d'élan et d'insouciance. Il incarne l'énergie du voyageur qui s'élance vers l'inconnu sans crainte, confiant dans la vie. C'est l'heure de l'aventure, de l'idéalisme et de la foi aveugle en son destin. Une occasion unique se présente — osez faire le grand saut.",
    reversed:
      "À l'envers, Le Mat met en garde contre une imprudence excessive, une naïveté qui pourrait mener à des erreurs coûteuses. Vous manquez peut-être de direction ou prenez des risques sans en mesurer les conséquences. Réfléchissez avant d'agir.",
    symbol: "fool",
  },
  {
    id: 1,
    name: "The Magician",
    nameFr: "Le Bateleur",
    arcana: "major",
    number: 1,
    keywords: ["manifestation", "habileté", "volonté", "action", "pouvoir créateur"],
    upright:
      "Le Bateleur représente la maîtrise des forces créatrices. Il possède tous les outils nécessaires et sait les utiliser avec habileté. C'est le moment de passer à l'action, de manifester vos projets dans la réalité. Votre volonté est votre baguette magique — concentrez-la sur votre but et il se réalisera.",
    reversed:
      "Renversé, Le Bateleur peut indiquer une manipulation, une tromperie ou des talents qui ne sont pas pleinement exploités. Il peut aussi signaler une mauvaise planification ou un manque de confiance en ses propres capacités. Méfiez-vous des imposteurs et de vous-même.",
    symbol: "magician",
  },
  {
    id: 2,
    name: "The High Priestess",
    nameFr: "La Papesse",
    arcana: "major",
    number: 2,
    keywords: ["intuition", "mystère", "connaissance secrète", "sagesse intérieure", "subconscient"],
    upright:
      "La Papesse est gardienne des mystères. Elle vous invite à vous tourner vers votre monde intérieur, à écouter votre intuition et à accéder à une sagesse qui va au-delà des mots. C'est une période propice à la méditation, à l'étude ésotérique et à la confiance en vos perceptions subtiles. Ce que vous ressentez est vrai.",
    reversed:
      "À l'envers, la Papesse indique une déconnexion de votre intuition, des secrets qui nuisent, ou une sagesse intérieure que vous refusez d'écouter. Vous vous laissez peut-être trop guider par la logique au détriment de votre ressenti profond.",
    symbol: "highpriestess",
  },
  {
    id: 3,
    name: "The Empress",
    nameFr: "L'Impératrice",
    arcana: "major",
    number: 3,
    keywords: ["abondance", "féminité", "nature", "fertilité", "créativité", "sensualité"],
    upright:
      "L'Impératrice est la grande mère nourricière, symbole d'abondance et de fertilité. Elle préside sur la nature, la beauté et la création. Sa présence annonce une période de prospérité, de créativité épanouie et de connexion avec le monde sensible. Amour, art, grossesse ou projets qui fleurissent — la vie s'exprime avec générosité.",
    reversed:
      "Renversée, l'Impératrice peut signaler un blocage créatif, une dépendance affective ou une surprotection étouffante. Elle peut aussi indiquer une déconnexion de la nature et du corps, ou une période de stagnation dans les projets créatifs.",
    symbol: "empress",
  },
  {
    id: 4,
    name: "The Emperor",
    nameFr: "L'Empereur",
    arcana: "major",
    number: 4,
    keywords: ["autorité", "structure", "stabilité", "pouvoir", "figure paternelle"],
    upright:
      "L'Empereur incarne l'autorité bienveillante, la structure et la stabilité. Il bâtit des fondations solides grâce à la discipline et à la logique. Sa présence indique qu'il est temps d'instaurer de l'ordre, d'assumer ses responsabilités et de diriger avec sagesse. La maîtrise de soi mène au succès.",
    reversed:
      "À l'envers, l'Empereur peut révéler une tyrannie, une rigidité excessive ou un abus de pouvoir. Il peut aussi indiquer une difficulté à s'affirmer, une rébellion contre toute forme d'autorité ou des problèmes avec une figure paternelle.",
    symbol: "emperor",
  },
  {
    id: 5,
    name: "The Hierophant",
    nameFr: "Le Pape",
    arcana: "major",
    number: 5,
    keywords: ["tradition", "sagesse spirituelle", "enseignement", "institution", "moralité"],
    upright:
      "Le Pape représente la sagesse transmise, la tradition et les institutions spirituelles. Il est le guide qui enseigne les valeurs morales et la voie tracée par les ancêtres. C'est l'heure de vous tourner vers un mentor, une communauté ou un système de croyances établi. Le respect des traditions peut vous offrir un ancrage précieux.",
    reversed:
      "Renversé, le Pape invite à questionner les dogmes, à s'émanciper des conventions étouffantes. Il peut aussi signaler une hypocrisie institutionnelle ou un conformisme aveugle. C'est le moment d'explorer votre propre spiritualité en dehors des cadres imposés.",
    symbol: "hierophant",
  },
  {
    id: 6,
    name: "The Lovers",
    nameFr: "Les Amoureux",
    arcana: "major",
    number: 6,
    keywords: ["amour", "choix", "harmonie", "valeurs", "union"],
    upright:
      "Les Amoureux symbolisent l'union, l'amour profond et les choix de vie déterminants. Cette carte parle d'harmonie entre le cœur et l'esprit, d'une relation significative ou d'une décision importante qui engage toute votre être. Faites confiance à vos valeurs les plus profondes pour guider votre choix — le cœur connaît le chemin.",
    reversed:
      "À l'envers, les Amoureux peuvent indiquer une désharmonie dans une relation, un mauvais choix ou des valeurs en conflit. Il peut s'agir d'une rupture, d'une infidélité ou d'une indécision paralysante face à un carrefour de vie important.",
    symbol: "lovers",
  },
  {
    id: 7,
    name: "The Chariot",
    nameFr: "Le Chariot",
    arcana: "major",
    number: 7,
    keywords: ["maîtrise", "volonté", "victoire", "détermination", "contrôle"],
    upright:
      "Le Chariot est la carte de la victoire par la maîtrise de soi. Il représente la force de volonté qui surmonte les obstacles, la détermination à avancer malgré les forces contraires. Vous avez le contrôle — gardez les rênes bien en main et foncer droit vers votre but. Le succès est au bout de la route.",
    reversed:
      "Renversé, le Chariot signale une perte de contrôle, une dispersion d'énergie ou un manque de direction. Les forces qui s'opposent prennent le dessus. Il est temps de retrouver votre focus et de reprendre les rênes de votre vie.",
    symbol: "chariot",
  },
  {
    id: 8,
    name: "Strength",
    nameFr: "La Force",
    arcana: "major",
    number: 8,
    keywords: ["courage", "patience", "force intérieure", "compassion", "maîtrise douce"],
    upright:
      "La Force n'est pas la puissance brute mais la force douce qui apprivoise les instincts. Elle représente le courage qui affronte les peurs avec sérénité, la patience qui transforme la bête en alliée. Vous possédez une résilience profonde — faites confiance à votre capacité à traverser les épreuves avec grâce et bienveillance.",
    reversed:
      "À l'envers, la Force indique le doute de soi, une faiblesse intérieure ou des émotions brutes qui débordent. Vous vous laissez peut-être dominer par vos peurs ou vos instincts. C'est le moment de retrouver votre centre et votre confiance.",
    symbol: "strength",
  },
  {
    id: 9,
    name: "The Hermit",
    nameFr: "L'Ermite",
    arcana: "major",
    number: 9,
    keywords: ["introspection", "solitude", "guidance intérieure", "sagesse", "retraite"],
    upright:
      "L'Ermite est le sage qui s'est retiré du monde pour trouver la lumière en lui-même. Il invite à une période de recueillement, d'introspection et de quête intérieure. Éloignez-vous du bruit du monde, méditez, cherchez en vous les réponses que vous n'avez pas trouvées à l'extérieur. La lanterne de la sagesse brille dans le silence.",
    reversed:
      "Renversé, l'Ermite peut signifier un isolement non choisi, une solitude douloureuse ou un refus de l'introspection nécessaire. Il peut aussi indiquer un retour dans le monde après une période de retrait, ou une tendance à se perdre dans ses pensées.",
    symbol: "hermit",
  },
  {
    id: 10,
    name: "Wheel of Fortune",
    nameFr: "La Roue de Fortune",
    arcana: "major",
    number: 10,
    keywords: ["destin", "karma", "cycles", "chance", "tournant de vie"],
    upright:
      "La Roue de Fortune annonce un tournant décisif dans votre vie. Elle rappelle que tout est cyclique — après la descente vient la montée. La chance tourne en votre faveur, le karma récompense vos bonnes actions. C'est un moment de changement et de renouveau. Accueillez ce nouveau cycle avec ouverture.",
    reversed:
      "À l'envers, la Roue peut signaler une période de malchance ou de résistance au changement. Vous luttez peut-être contre un cycle inéluctable au lieu de l'accepter. Rappelez-vous que même les mauvaises périodes ont une fin — la roue tourne toujours.",
    symbol: "wheel",
  },
  {
    id: 11,
    name: "Justice",
    nameFr: "La Justice",
    arcana: "major",
    number: 11,
    keywords: ["équité", "vérité", "loi", "cause et effet", "responsabilité"],
    upright:
      "La Justice est impartiale et inévitable. Elle représente l'équilibre entre l'action et ses conséquences, la vérité qui s'impose, les décisions légales ou morales. Cette carte vous rappelle que chaque acte porte ses fruits — bons ou mauvais. Une situation sera bientôt tranchée avec équité. La vérité viendra au grand jour.",
    reversed:
      "Renversée, la Justice peut indiquer une injustice, un jugement partial ou un refus d'assumer ses responsabilités. Des décisions légales défavorables ou une incapacité à voir la vérité en face peuvent se présenter.",
    symbol: "justice",
  },
  {
    id: 12,
    name: "The Hanged Man",
    nameFr: "Le Pendu",
    arcana: "major",
    number: 12,
    keywords: ["pause", "lâcher-prise", "nouvelle perspective", "sacrifice", "attente"],
    upright:
      "Le Pendu est suspendu volontairement — il a choisi de s'immobiliser pour voir le monde autrement. Cette carte invite à la pause, au lâcher-prise sur ce que vous croyez contrôler. En vous offrant ce temps de suspension, vous verrez les choses sous un angle entièrement nouveau. Le sacrifice consenti mène à l'illumination.",
    reversed:
      "À l'envers, le Pendu signale une résistance à la pause nécessaire, des délais qui frustrent ou une indécision qui paralyse. Vous refusez peut-être de voir les choses autrement, ou vous vous sentez bloqué sans comprendre pourquoi.",
    symbol: "hangedman",
  },
  {
    id: 13,
    name: "Death",
    nameFr: "La Mort",
    arcana: "major",
    number: 13,
    keywords: ["transformation", "fin de cycle", "changement profond", "renouveau", "renaissance"],
    upright:
      "La Mort n'est pas la fin — c'est la transformation la plus profonde. Elle annonce la clôture d'un cycle important pour que quelque chose de nouveau puisse naître. Ce qui doit mourir, c'est ce qui vous empêche d'avancer. Accueillez ce changement radical avec courage : l'autre côté est la renaissance.",
    reversed:
      "Renversée, la Mort indique une résistance au changement inévitable, une stagnation douloureuse. Vous vous accrochez à ce qui est déjà mort. Lâchez prise — la transformation que vous fuyez est celle dont vous avez le plus besoin.",
    symbol: "death",
  },
  {
    id: 14,
    name: "Temperance",
    nameFr: "La Tempérance",
    arcana: "major",
    number: 14,
    keywords: ["équilibre", "modération", "patience", "harmonie", "alchimie"],
    upright:
      "La Tempérance est l'art de l'équilibre et du juste milieu. Elle représente l'alchimie de la vie — le mélange harmonieux de ses différentes composantes. Cette carte invite à la patience, à la modération et à la recherche de l'harmonie intérieure. Votre chemin se trace avec douceur et persévérance. Les extrêmes ne sont pas votre voie.",
    reversed:
      "À l'envers, la Tempérance signale un déséquilibre, des excès dans un domaine de vie ou un manque de patience. Des conflits intérieurs créent une dissonance. Il est temps de retrouver votre centre et de rééquilibrer vos énergies.",
    symbol: "temperance",
  },
  {
    id: 15,
    name: "The Devil",
    nameFr: "Le Diable",
    arcana: "major",
    number: 15,
    keywords: ["attachements", "ombre", "dépendances", "illusions", "matérialisme"],
    upright:
      "Le Diable représente les chaînes que nous forgeons nous-mêmes — les dépendances, les attachements malsains, les peurs qui nous contrôlent. Il met en lumière les aspects sombres de notre nature que nous refusons de voir. Prenez conscience de ce qui vous enchaîne : les liens ne sont pas aussi solides qu'ils le semblent. La liberté est possible.",
    reversed:
      "Renversé, le Diable annonce une libération des attachements, une prise de conscience salvatrice. Vous brisez les chaînes d'une dépendance ou d'une relation toxique. La lumière revient après l'ombre. C'est un moment de véritable émancipation.",
    symbol: "devil",
  },
  {
    id: 16,
    name: "The Tower",
    nameFr: "La Tour",
    arcana: "major",
    number: 16,
    keywords: ["bouleversement", "révélation", "chaos", "éveil", "effondrement libérateur"],
    upright:
      "La Tour annonce un bouleversement soudain et inattendu qui détruit ce qui était mal construit. Aussi brutal que ce changement puisse sembler, il est nécessaire — il libère des fondations mensongères. Ce qui s'effondre devait tomber. C'est un éveil brutal mais essentiel. De nouvelles bases plus solides seront bâties sur les ruines.",
    reversed:
      "À l'envers, la Tour peut indiquer une résistance au changement inévitable, une catastrophe évitée de justesse ou une transformation intérieure moins dramatique mais tout aussi profonde. La crise que vous redoutez peut encore être transformée en opportunité.",
    symbol: "tower",
  },
  {
    id: 17,
    name: "The Star",
    nameFr: "L'Étoile",
    arcana: "major",
    number: 17,
    keywords: ["espoir", "foi", "inspiration", "renaissance", "connexion spirituelle"],
    upright:
      "L'Étoile brille après la tempête. Elle représente l'espoir renouvelé, la foi dans l'avenir et la connexion avec quelque chose de plus grand que soi. Cette carte annonce une période de guérison, d'inspiration et de sérénité après une épreuve. Vous êtes guidé, protégé. Laissez la lumière de l'Étoile vous montrer le chemin.",
    reversed:
      "Renversée, l'Étoile indique un manque de foi, un désespoir ou une perte de confiance en l'avenir. Vous vous sentez peut-être abandonné du destin ou déconnecté de votre source spirituelle. Rappelez-vous : l'obscurité n'est que temporaire.",
    symbol: "star",
  },
  {
    id: 18,
    name: "The Moon",
    nameFr: "La Lune",
    arcana: "major",
    number: 18,
    keywords: ["illusions", "peurs inconscientes", "mystère", "intuition profonde", "confusion"],
    upright:
      "La Lune règne sur le royaume de l'inconscient, des illusions et des peurs nocturnes. Elle révèle ce qui se cache dans l'ombre — vos craintes les plus profondes, les mensonges que vous vous racontez, les forces invisibles qui influencent votre vie. Faites confiance à votre intuition dans cette période de brouillard. Tout n'est pas ce qu'il semble.",
    reversed:
      "À l'envers, la Lune annonce la dissipation d'une confusion, la libération d'une peur ou la révélation d'une vérité cachée. Le voile se lève progressivement. Ce qui était obscur devient peu à peu clair.",
    symbol: "moon",
  },
  {
    id: 19,
    name: "The Sun",
    nameFr: "Le Soleil",
    arcana: "major",
    number: 19,
    keywords: ["joie", "vitalité", "succès", "clarté", "épanouissement"],
    upright:
      "Le Soleil est la carte du bonheur pur et de la vitalité radieuse. Il illumine tout ce qu'il touche, chasse les ombres et révèle la beauté de la vie. C'est une période de joie, de succès, de clarté et d'épanouissement. Votre enfant intérieur s'exprime librement. Toutes les conditions sont réunies pour que vous rayonniez.",
    reversed:
      "Renversé, le Soleil peut indiquer un optimisme excessif, une période de morosité passagère ou une joie qui tarde à se manifester. L'enfant intérieur est peut-être blessé ou étouffé. La lumière est là — regardez-la.",
    symbol: "sun",
  },
  {
    id: 20,
    name: "Judgement",
    nameFr: "Le Jugement",
    arcana: "major",
    number: 20,
    keywords: ["éveil", "renaissance", "appel intérieur", "bilan", "absolution"],
    upright:
      "Le Jugement sonne l'heure de l'éveil et de la renaissance. Il invite à faire le bilan de votre parcours, à vous pardonner vos erreurs et à répondre à l'appel profond de votre âme. Une transformation décisive est en cours — vous êtes appelé à vous élever, à vous réinventer. C'est l'heure de la résurrection intérieure.",
    reversed:
      "À l'envers, le Jugement peut signaler une autocritique excessive, un refus de se remettre en question ou un appel intérieur ignoré. Vous hésitez à tourner la page sur le passé. L'absolution que vous cherchez ne peut venir que de vous-même.",
    symbol: "judgement",
  },
  {
    id: 21,
    name: "The World",
    nameFr: "Le Monde",
    arcana: "major",
    number: 21,
    keywords: ["accomplissement", "intégration", "plénitude", "voyage", "complétude"],
    upright:
      "Le Monde est la carte de l'accomplissement absolu. Elle célèbre la fin heureuse d'un long voyage, l'intégration de toutes les expériences vécues en une sagesse complète. Vous êtes arrivé à destination — savourez ce moment de plénitude et de réussite. Un nouveau cycle commence déjà sur l'horizon, plus riche de tout ce que vous avez appris.",
    reversed:
      "Renversé, le Monde indique une clôture incomplète, des raccourcis qui empêchent l'accomplissement total. Un cycle n'est pas encore pleinement terminé. Prenez le temps de finaliser ce qui est resté en suspens avant de vous élancer vers la suite.",
    symbol: "world",
  },
];

// ─── Minor Arcana specific meanings ───────────────────────────────────────
type CardMeaning = { upright: string; reversed: string; keywords: string[] };

const WANDS_MEANINGS: CardMeaning[] = [
  { keywords: ["inspiration", "nouveau départ", "élan créatif"], upright: "L'As de Bâtons est une étincelle de vie pure. Il annonce un nouveau départ plein de passion et d'inspiration créatrice. Une idée brillante, un projet qui prend feu — l'énergie est là pour agir.", reversed: "L'élan créatif est bloqué, l'inspiration tarde à venir. Remettez en question votre motivation avant de vous lancer." },
  { keywords: ["vision", "planification", "anticipation"], upright: "Le Deux de Bâtons incarne la vision à long terme. Vous planifiez votre avenir avec ambition depuis un poste d'observation élevé. Le monde vous appartient — choisissez votre direction.", reversed: "Peur de l'inconnu, plans qui stagnent. Vous hésitez à quitter votre zone de confort malgré votre potentiel." },
  { keywords: ["expansion", "croissance", "premiers succès"], upright: "Le Trois de Bâtons annonce une expansion vers de nouveaux horizons. Vos efforts commencent à porter leurs fruits. Des voyages, des opportunités à l'international ou une croissance significative se profilent.", reversed: "Des obstacles bloquent votre expansion. Des délais inattendus freinent vos projets ambitieux." },
  { keywords: ["célébration", "harmonie", "foyer"], upright: "Le Quatre de Bâtons célèbre l'harmonie, la stabilité et la joie partagée. C'est une période de festivités, de réussite familiale et de satisfaction méritée. Le foyer est un lieu de bonheur.", reversed: "Tensions à la maison, harmonie troublée. Une célébration est peut-être reportée ou les fondations d'une relation sont remises en question." },
  { keywords: ["compétition", "conflits", "ambition"], upright: "Le Cinq de Bâtons représente la compétition et les désaccords stimulants. Les conflits d'idées peuvent être productifs s'ils sont bien canalisés. C'est l'heure de défendre votre position.", reversed: "Conflits intérieurs, évitement des affrontements nécessaires. Ou au contraire, une compétition acharnée qui épuise sans profit." },
  { keywords: ["victoire", "reconnaissance", "succès public"], upright: "Le Six de Bâtons est la carte du triomphe public. Vos accomplissements sont reconnus, vous recevez les honneurs mérités. La confiance en soi rayonne — vous avez gagné.", reversed: "Victoire en retard, manque de reconnaissance. L'orgueil peut jouer des tours. Gardez la tête sur les épaules." },
  { keywords: ["défi", "résistance", "persévérance"], upright: "Le Sept de Bâtons vous montre en position de défense, mais en avantage. Vous avez du terrain à tenir et des challengers à repousser. Tenez votre position avec conviction — vous pouvez l'emporter.", reversed: "Vous capitullez face à la pression, abandonnez une position pourtant défendable. Retrouvez votre confiance et votre courage." },
  { keywords: ["mouvement rapide", "action", "messages"], upright: "Le Huit de Bâtons symbolise la vitesse et le mouvement. Les nouvelles arrivent vite, les projets avancent rapidement, les communications s'accélèrent. L'action est immédiate — soyez prêt.", reversed: "Précipitation, malentendus ou projets qui partent dans tous les sens. Prenez le temps de vous organiser avant d'agir." },
  { keywords: ["résilience", "persévérance", "dernière épreuve"], upright: "Le Neuf de Bâtons vous trouve épuisé mais debout. Vous avez traversé beaucoup d'épreuves et portez les cicatrices du combat. Mais vous résistez encore — tenez bon, la victoire finale est proche.", reversed: "La résistance cède, les défenses tombent. Vous êtes peut-être trop sur la défensive ou épuisé pour continuer à vous battre." },
  { keywords: ["fardeau", "surcharge", "responsabilités"], upright: "Le Dix de Bâtons ploie sous le poids des responsabilités. Vous portez une charge trop lourde pour une seule personne. Il est temps de déléguer, de lâcher ce qui n'est pas à vous et de vous alléger.", reversed: "Vous vous effondrez sous les obligations ou vous les fuyez. Apprenez à dire non et à poser certains fardeaux." },
  { keywords: ["enthousiasme", "exploration", "nouvelles énergies"], upright: "Le Valet de Bâtons déborde d'enthousiasme et de curiosité. Il apporte de nouvelles idées, de l'élan et une énergie juvénile. Un message passionné ou une nouvelle opportunité se présente.", reversed: "Manque de direction, énergie dispersée ou enthousiasme mal canalisé. Les idées abondent mais l'action tarde." },
  { keywords: ["impétuosité", "passion", "aventure"], upright: "Le Cavalier de Bâtons fonce avec une passion ardente et une énergie explosive. Il représente un homme (ou une action) impulsif, charmant et aventurier. Préparez-vous au mouvement et au changement rapide.", reversed: "Impulsivité dangereuse, manque de réflexion. L'énergie du Cavalier s'emballe — prudence avec les décisions précipitées." },
  { keywords: ["confiance", "charisme", "leadership créatif"], upright: "La Reine de Bâtons rayonne de confiance et de charisme. Indépendante, passionnée et déterminée, elle inspire les autres par sa force de caractère. C'est le moment d'exprimer votre autorité naturelle avec chaleur.", reversed: "Jalousie, égocentrisme ou perte de confiance en soi. Le charisme se transforme en domination étouffante." },
  { keywords: ["vision", "maîtrise", "leadership"], upright: "Le Roi de Bâtons est un leader visionnaire, entrepreneur né et maître de sa destinée. Il dirige avec passion et intégrité, transformant ses visions en réalités concrètes. Une présence forte et inspirante entre dans votre vie.", reversed: "Arrogance, impulsivité ou leadership tyrannique. La vision devient obstination, la passion vire à l'autoritarisme." },
];

const CUPS_MEANINGS: CardMeaning[] = [
  { keywords: ["amour naissant", "créativité émotionnelle", "grâce divine"], upright: "L'As de Coupes est le cadeau du cœur — un amour profond, une émotion pure, une nouvelle connexion spirituelle. Les sentiments débordent avec générosité. C'est le début d'une belle histoire.", reversed: "Le cœur se ferme, les émotions sont bloquées ou refoulées. Une relation ne peut pas s'épanouir dans ces conditions." },
  { keywords: ["union", "partenariat", "connexion mutuelle"], upright: "Le Deux de Coupes célèbre l'union de deux êtres en harmonie profonde. Qu'il s'agisse d'amour romantique ou d'une association, cette connexion est fondée sur le respect et la réciprocité.", reversed: "Désaccord dans une relation, séparation ou déséquilibre émotionnel entre deux personnes qui s'éloignent." },
  { keywords: ["amitié", "célébration", "joie partagée"], upright: "Le Trois de Coupes convie à la fête ! Amitié profonde, célébrations joyeuses, soutien de votre entourage. C'est le moment de partager vos succès et de profiter de la compagnie de ceux que vous aimez.", reversed: "Excès de fête, amitié superficielle ou commérage. Un groupe toxique peut avoir une mauvaise influence sur vous." },
  { keywords: ["contemplation", "apathie", "introspection"], upright: "Le Quatre de Coupes invite à l'introspection. Vous vous sentez peut-être blasé ou insatisfait malgré ce que vous avez. Regardez bien — une opportunité vous est offerte, mais vous ne la voyez pas encore.", reversed: "Sortie d'une période d'apathie, réengagement dans la vie. Vous êtes prêt à saisir ce que vous aviez ignoré." },
  { keywords: ["perte", "deuil", "déception"], upright: "Le Cinq de Coupes parle de perte et de regrets. Trois coupes sont renversées — mais deux sont encore debout. Faites votre deuil de ce qui est perdu, mais ne perdez pas de vue ce qui reste précieux.", reversed: "Sortie du deuil, acceptation et pardon. Vous relevez enfin la tête et commencez à voir le côté positif." },
  { keywords: ["nostalgie", "souvenirs d'enfance", "innocence"], upright: "Le Six de Coupes vous plonge dans la nostalgie et les souvenirs doux du passé. Un enfant vous offre un bouquet — c'est la pureté, l'innocence et les joies simples qui sont mises à l'honneur.", reversed: "Vous vivez trop dans le passé, idéalisez ce qui n'est plus. Il est temps de revenir au présent." },
  { keywords: ["illusions", "rêves", "choix multiples"], upright: "Le Sept de Coupes présente de nombreuses options toutes aussi séduisantes que trompeuses. Entre rêves et illusions, le choix est difficile. Discernez la réalité des fantasmes avant de décider.", reversed: "La confusion se dissipe, vous voyez les choses avec plus de clarté. Ou au contraire, une fuite dans les illusions s'intensifie." },
  { keywords: ["abandon", "quête spirituelle", "départ vers l'inconnu"], upright: "Le Huit de Coupes montre quelqu'un qui tourne le dos à ce qu'il a bâti pour chercher quelque chose de plus profond. Un abandon courageux pour une quête de sens plus élevée. Le cœur appelle vers l'inconnu.", reversed: "Hésitation à quitter une situation insatisfaisante, ou retour vers le passé au lieu d'avancer." },
  { keywords: ["satisfaction", "vœux exaucés", "bien-être"], upright: "Le Neuf de Coupes est la carte du contentement — les vœux se réalisent, la satisfaction est totale. C'est une période de plaisir, de bien-être et d'accomplissement émotionnel. Le cœur est comblé.", reversed: "Satisfaction superficielle, vœux exaucés qui déçoivent. Le matériel n'apporte pas le bonheur espéré." },
  { keywords: ["harmonie familiale", "plénitude", "bonheur durable"], upright: "Le Dix de Coupes est l'image du bonheur parfait — famille unie, amour épanoui, plénitude émotionnelle. C'est l'accomplissement de vos rêves affectifs. Chérissez ces liens précieux.", reversed: "Tensions familiales, illusion d'harmonie cachant des problèmes profonds, ou isolement affectif." },
  { keywords: ["sensibilité", "messages du cœur", "intuition"], upright: "Le Valet de Coupes apporte des nouvelles touchant au cœur — peut-être une déclaration, un message créatif ou une invitation à explorer votre monde émotionnel et intuitif.", reversed: "Hypersensibilité, manipulation émotionnelle ou mauvaises nouvelles affectives." },
  { keywords: ["romantisme", "charme", "proposition"], upright: "Le Cavalier de Coupes arrive avec une proposition romantique ou une offre pleine de poésie. Il est charmant, idéaliste et généreux. Une belle rencontre ou une invitation douce se présente.", reversed: "Séduction mensongère, promesses non tenues ou idéalisme naïf qui mène à la déception." },
  { keywords: ["empathie", "intuition profonde", "soutien émotionnel"], upright: "La Reine de Coupes est une âme empathique et intuitive. Elle comprend les émotions profondes et offre un soutien bienveillant. Faites confiance à votre ressenti — il ne vous trompe pas.", reversed: "Émotions envahissantes, dépendance affective ou manipulation émotionnelle. Gardez vos limites." },
  { keywords: ["maturité émotionnelle", "compassion", "sagesse du cœur"], upright: "Le Roi de Coupes allie intelligence émotionnelle et sagesse. Il gère ses sentiments avec maturité et offre un soutien stable et chaleureux. Une figure bienveillante et équilibrée entre dans votre vie.", reversed: "Émotions réprimées ou manipulées, froideur cachée derrière une façade bienveillante." },
];

const SWORDS_MEANINGS: CardMeaning[] = [
  { keywords: ["clarté mentale", "vérité tranchante", "décision nette"], upright: "L'As d'Épées apporte une clarté éblouissante et une vérité qui tranche net. C'est la percée intellectuelle, la décision prise avec conviction, la force de la raison qui dissipe les doutes.", reversed: "Confusion mentale, mauvaise décision ou vérité difficile refusée. Le mental se perd dans ses propres contradictions." },
  { keywords: ["impasse", "équilibre fragile", "évitement"], upright: "Le Deux d'Épées représente une impasse, un refus de voir la réalité en face. Les yeux bandés, vous maintenez un équilibre précaire. Il faudra bientôt choisir un camp et faire face à la vérité.", reversed: "La décision est enfin prise, mais le conflit peut s'intensifier. La situation se débloque, pas toujours sans douleur." },
  { keywords: ["douleur", "trahison", "chagrin"], upright: "Le Trois d'Épées est la carte du cœur blessé — trahison, séparation douloureuse ou désillusion profonde. La douleur est réelle, mais elle est nécessaire pour guérir. Laissez les larmes couler.", reversed: "Guérison progressive d'une blessure, pardon ou deuil accepté. La douleur commence à s'estomper." },
  { keywords: ["repos", "récupération", "retraite"], upright: "Le Quatre d'Épées invite au repos et à la récupération mentale. Après le conflit, voici la trêve. Retirez-vous, méditez, prenez soin de vous. Le repos n'est pas une faiblesse — c'est une nécessité.", reversed: "Agitation intérieure, incapacité à se reposer malgré la fatigue. Ou retour à l'action après une période de pause." },
  { keywords: ["défaite", "victoire creuse", "conflit"], upright: "Le Cinq d'Épées parle d'une victoire à la Pyrrhus — vous avez peut-être gagné la bataille mais perdu quelque chose d'essentiel. Réévaluez les vraies priorités dans ce conflit.", reversed: "Passage du conflit à la réconciliation. Chacun lèche ses plaies et cherche la paix après une lutte épuisante." },
  { keywords: ["transition", "voyage", "passage difficile"], upright: "Le Six d'Épées annonce un passage délicat mais nécessaire. Vous quittez des eaux agitées pour des temps meilleurs. Ce voyage vers un nouveau chapitre demande du courage et de la confiance.", reversed: "Résistance à une transition nécessaire ou retour forcé dans une situation que l'on croyait réglée." },
  { keywords: ["tromperie", "stratégie secrète", "fuite"], upright: "Le Sept d'Épées invite à la prudence face à la tromperie — la vôtre ou celle des autres. Une stratégie secrète est à l'œuvre. Vérifiez la loyauté de votre entourage et l'honnêteté de vos propres actions.", reversed: "La vérité sort du sac, une tromperie est démasquée. Ou vous renoncez à une stratégie malhonnête." },
  { keywords: ["emprisonnement mental", "limitations", "pensées négatives"], upright: "Le Huit d'Épées représente l'emprisonnement par les pensées — vous vous sentez bloqué, restreint, impuissant. Mais regardez bien : les liens sont lâches, les yeux bandés peuvent l'être. La liberté est plus proche que vous ne croyez.", reversed: "Libération progressive des croyances limitantes. Vous commencez à voir les issues là où vous ne voyiez que des murs." },
  { keywords: ["anxiété nocturne", "ruminations", "cauchemars"], upright: "Le Neuf d'Épées est la carte des nuits sans sommeil, des pensées qui tournent en boucle et des peurs qui se nourrissent elles-mêmes. Cherchez de l'aide — vous n'avez pas à porter ce fardeau seul.", reversed: "La phase d'anxiété se termine, la lumière revient. Vous trouvez des stratégies pour gérer vos pensées sombres." },
  { keywords: ["fin douloureuse", "trahison ultime", "renaissance"], upright: "Le Dix d'Épées annonce une fin brutale et douloureuse. Un cycle se clôt de façon définitive — peut-être une trahison, un échec ou une perte irréversible. Mais l'aube se lève derrière cette nuit noire.", reversed: "Refus d'accepter une fin inévitable, ou sortie progressive d'une période très difficile." },
  { keywords: ["curiosité intellectuelle", "vigilance", "nouvelles importantes"], upright: "Le Valet d'Épées apporte une énergie mentale vive et alerte. Des nouvelles importantes arrivent — restez vigilant et prêt à agir. La curiosité intellectuelle est votre meilleur atout.", reversed: "Bavardages, espionnage ou informations utilisées à mauvais escient. Méfiez-vous des langues acérées." },
  { keywords: ["ambition tranchante", "rapidité", "impulsivité"], upright: "Le Cavalier d'Épées fonce avec une ambition coupante et une rapidité déconcertante. Il représente l'action directe, la pensée vive et la volonté d'aller droit au but, parfois au mépris des conséquences.", reversed: "Précipitation dangereuse, agressivité ou projets qui partent dans tous les sens sans direction claire." },
  { keywords: ["indépendance", "clarté", "discernement"], upright: "La Reine d'Épées est une femme de tête, indépendante et perspicace. Elle voit la réalité telle qu'elle est, sans illusions. Sa franchise peut blesser mais elle porte la vérité. Faites confiance à son discernement.", reversed: "Froide cruauté, amertume ou manipulation intellectuelle. La clarté devient arme au lieu d'outil." },
  { keywords: ["autorité intellectuelle", "logique", "justice"], upright: "Le Roi d'Épées incarne l'autorité de la raison et de la justice. Analytique, juste et impartial, il tranche avec logique. Son jugement est droit — faites appel à la raison dans vos décisions importantes.", reversed: "Tyrannie intellectuelle, jugements froids et inhumains. La raison dépourvue de compassion devient destructrice." },
];

const PENTACLES_MEANINGS: CardMeaning[] = [
  { keywords: ["opportunité matérielle", "abondance", "nouvelle source de revenus"], upright: "L'As de Pentacles ouvre une porte vers l'abondance matérielle. Une nouvelle opportunité financière, un projet concret ou un cadeau de la fortune se présente. Saisissez-le avec gratitude.", reversed: "Occasion manquée, mauvais investissement ou faux espoir financier. Évaluez soigneusement les opportunités." },
  { keywords: ["équilibre financier", "jonglerie", "adaptabilité"], upright: "Le Deux de Pentacles représente l'art de jongler avec les ressources et les priorités. Vous gérez plusieurs projets ou dépenses à la fois avec souplesse. La flexibilité est votre force.", reversed: "Déséquilibre financier, difficulté à gérer plusieurs obligations. Il faut lâcher quelque chose pour retrouver l'équilibre." },
  { keywords: ["travail d'équipe", "compétence", "maîtrise artisanale"], upright: "Le Trois de Pentacles célèbre la collaboration et le travail bien fait. La compétence est reconnue, les projets avancent grâce à des efforts coordonnés. L'excellence dans votre domaine porte ses fruits.", reversed: "Manque de coopération, travail bâclé ou talent sous-estimé. Les conflits d'ego freinent la progression." },
  { keywords: ["sécurité", "épargne", "attachement aux biens"], upright: "Le Quatre de Pentacles parle de sécurité matérielle et d'épargne. Vous protégez ce que vous avez avec soin. Mais prenez garde : l'attachement excessif aux biens matériels peut devenir une prison.", reversed: "Dépenses impulsives, générosité retrouvée ou peur de manquer qui se dissipe. L'argent circule à nouveau." },
  { keywords: ["difficultés financières", "pauvreté", "exclusion"], upright: "Le Cinq de Pentacles annonce une période de difficultés matérielles ou d'exclusion. Vous vous sentez peut-être dans le froid, laissé pour compte. Mais regardez — la lumière de l'église est là. Demandez de l'aide.", reversed: "Sortie d'une période de difficultés, aide reçue ou fin d'une période de manque. La situation s'améliore." },
  { keywords: ["générosité", "partage", "équilibre donner/recevoir"], upright: "Le Six de Pentacles illustre l'acte de partager avec générosité et équité. Que vous soyez celui qui donne ou celui qui reçoit, il s'agit de trouver l'équilibre juste dans les échanges matériels.", reversed: "Générosité conditionnelle, déséquilibre dans les échanges ou dettes qui pèsent sur les relations." },
  { keywords: ["patience", "évaluation", "attente des fruits"], upright: "Le Sept de Pentacles invite à l'évaluation patiente de vos efforts. Vous avez semé — maintenant vous observez pousser. Prenez le temps d'évaluer si vos investissements vous mènent où vous le souhaitez.", reversed: "Impatience, déception face à des résultats qui tardent, ou remise en question d'un projet à mi-parcours." },
  { keywords: ["apprentissage", "perfectionnement", "travail minutieux"], upright: "Le Huit de Pentacles est la carte du perfectionnement. Vous affinez votre art, apprenez avec soin et appliquez chaque détail avec précision. C'est par la pratique répétée que naît la véritable maîtrise.", reversed: "Travail bâclé, perfectionnisme paralysant ou apprentissage qui stagne. Retrouvez votre curiosité." },
  { keywords: ["abondance méritée", "indépendance", "accomplissement"], upright: "Le Neuf de Pentacles célèbre l'abondance méritée et l'indépendance financière. Vous jouissez des fruits de votre travail avec élégance et satisfaction. Ce confort, vous l'avez bien gagné.", reversed: "Dépendance financière, apparences trompeuses ou richesse matérielle vide de sens intérieur." },
  { keywords: ["richesse familiale", "héritage", "sécurité durable"], upright: "Le Dix de Pentacles représente la richesse sur le long terme — l'héritage familial, la sécurité transmise de génération en génération. C'est l'accomplissement matériel dans sa forme la plus durable.", reversed: "Conflits familiaux autour de l'argent ou d'un héritage, instabilité financière ou rupture avec les traditions." },
  { keywords: ["ambition pratique", "apprenti sérieux", "opportunités concrètes"], upright: "Le Valet de Pentacles est un apprenti sérieux et ambitieux. Il apporte de bonnes nouvelles financières ou une nouvelle opportunité d'apprentissage. La patience et la détermination mèneront loin.", reversed: "Manque de discipline, procrastination ou opportunité manquée par manque de préparation." },
  { keywords: ["méthode", "persévérance", "progression sûre"], upright: "Le Cavalier de Pentacles avance lentement mais sûrement. Méthodique et fiable, il ne lâche pas prise. Sa progression est garantie — pas de feux d'artifice, mais un effort constant et des résultats solides.", reversed: "Stagnation, lenteur excessive ou résistance au changement qui freine la progression." },
  { keywords: ["générosité abondante", "ancrage", "nourricière"], upright: "La Reine de Pentacles est une figure nourricière et généreuse, ancrée dans la réalité matérielle. Elle sait créer un foyer accueillant et gérer les ressources avec sagesse pratique.", reversed: "Matérialisme excessif, générosité intéressée ou manque d'équilibre entre vie professionnelle et personnelle." },
  { keywords: ["maîtrise matérielle", "entreprise", "richesse construite"], upright: "Le Roi de Pentacles incarne la réussite matérielle bâtie avec sagesse et patience. C'est l'homme d'affaires accompli, le gestionnaire hors pair. Il transforme les ressources en richesse durable.", reversed: "Obsession pour l'argent, corruption ou utilisation des ressources à des fins égoïstes." },
];

function createMinorArcana(
  suit: "wands" | "cups" | "swords" | "pentacles",
  startId: number
): TarotCard[] {
  const suitData = {
    wands: { nameFr: "Bâtons", meanings: WANDS_MEANINGS },
    cups: { nameFr: "Coupes", meanings: CUPS_MEANINGS },
    swords: { nameFr: "Épées", meanings: SWORDS_MEANINGS },
    pentacles: { nameFr: "Pentacles", meanings: PENTACLES_MEANINGS },
  };

  const numbers = [
    { n: 1, name: "Ace", nameFr: "As" },
    { n: 2, name: "Two", nameFr: "Deux" },
    { n: 3, name: "Three", nameFr: "Trois" },
    { n: 4, name: "Four", nameFr: "Quatre" },
    { n: 5, name: "Five", nameFr: "Cinq" },
    { n: 6, name: "Six", nameFr: "Six" },
    { n: 7, name: "Seven", nameFr: "Sept" },
    { n: 8, name: "Eight", nameFr: "Huit" },
    { n: 9, name: "Nine", nameFr: "Neuf" },
    { n: 10, name: "Ten", nameFr: "Dix" },
    { n: 11, name: "Page", nameFr: "Valet" },
    { n: 12, name: "Knight", nameFr: "Cavalier" },
    { n: 13, name: "Queen", nameFr: "Reine" },
    { n: 14, name: "King", nameFr: "Roi" },
  ];

  const suitInfo = suitData[suit];
  const suitNameCap = suit.charAt(0).toUpperCase() + suit.slice(1);

  return numbers.map((num, i) => ({
    id: startId + i,
    name: `${num.name} of ${suitNameCap}`,
    nameFr: `${num.nameFr} de ${suitInfo.nameFr}`,
    arcana: "minor" as const,
    suit,
    number: num.n,
    keywords: suitInfo.meanings[i].keywords,
    upright: suitInfo.meanings[i].upright,
    reversed: suitInfo.meanings[i].reversed,
    symbol: suit,
  }));
}

export const MINOR_ARCANA: TarotCard[] = [
  ...createMinorArcana("wands", 22),
  ...createMinorArcana("cups", 36),
  ...createMinorArcana("swords", 50),
  ...createMinorArcana("pentacles", 64),
];

export const ALL_TAROT_CARDS: TarotCard[] = [
  ...MAJOR_ARCANA,
  ...MINOR_ARCANA,
];

export const SUBJECTS = [
  { value: "love", label: "Amour", labelEn: "Love" },
  { value: "family", label: "Famille", labelEn: "Family" },
  { value: "friendship", label: "Amitié", labelEn: "Friendship" },
  { value: "money", label: "Argent", labelEn: "Money" },
  { value: "job", label: "Travail", labelEn: "Job" },
  { value: "school", label: "École", labelEn: "School" },
  { value: "career", label: "Carrière", labelEn: "Career" },
  { value: "future", label: "Futur", labelEn: "Future" },
];

export function shuffleDeck(cards: TarotCard[]): TarotCard[] {
  const deck = [...cards];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
