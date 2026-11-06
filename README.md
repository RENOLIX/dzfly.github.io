# DZ FLY

Première version du site DZ FLY, réalisée le 6 novembre 2026.

Dépôt : https://github.com/RENOLIX/dzfly.github.io

GitHub Pages : https://renolix.github.io/dzfly.github.io/

## Publication GitHub Pages

Chaque push sur `main` lance `.github/workflows/pages.yml` : les vérifications sont exécutées sous Node.js 24, puis le contenu de `dist` est publié par GitHub Pages. Le site utilise des chemins relatifs compatibles avec le sous-dossier du dépôt. Les secrets fournisseurs devront rester dans un futur backend ; GitHub Pages héberge uniquement la partie statique.

## Ajustements des transitions

### Photo Hébergement sur téléphone

Sous 761 px, `hero-stays-mobile.webp` remplace le fond horizontal. La version PC reste `hero-stays.webp`. Les préchargements suivent le même seuil afin de ne pas télécharger les deux formats sur téléphone. Le badge « Version découverte » du hero a été retiré ; les indications sur les résultats fictifs restent présentes dans le parcours de démonstration.

L’image mobile a été adaptée avec le générateur intégré Imagegen à partir de la photo PC `dist/assets/hero-stays.png`. Sources livrées : `dist/assets/hero-stays-mobile.png` et version WebP optimisée `dist/assets/hero-stays-mobile.webp`.

Prompt utilisé :

> Use case: precise-object-edit / background extension. Edit target: the attached desktop hotel hero photograph. The user explicitly wants THE SAME PHOTOGRAPH AND SAME HOTEL, only adapted for a smartphone. Create a tall portrait 9:20 or 1:2 mobile version by carefully reframing and extending the image above and below. Keep the exact same small ivory-stone villas on left and right, same pergola, same sun loungers and towels, same two palms, same warm round lamps and amber interior lighting, same infinity pool, distant island silhouettes and navy-blue dusk with peach horizon. Preserve this specific resort identity, photographic style and material textures; do not replace it with another resort, add floors, balconies, buildings, people, text, logos or watermarks. Fit BOTH recognizable villas and pool into the portrait composition so they remain visible on a narrow screen; do not just crop the center into sky and sea. Less empty sky than the source: the roof of the left villa should begin at about 24 percent down, horizon about 45 percent down, pool lower 45 percent. Retain dark clear navy sky near the top and center for white header and headline. Continue the existing pool water naturally toward the bottom. The result should clearly look like the same existing desktop photograph made vertical, not a new hotel image.

- Point bleu avant le titre supprimé.
- Curseur blanc unique glissant entre Vols et Hébergement (580 ms), avec sens inversé en arabe.
- Fond distinct par service et fondu de 850 ms, léger mouvement du fond sur 1 400 ms.
- Hauteur du hero identique entre les services, vérifiée sur desktop, tablette et mobile. La carte Hébergement présente un fond blanc compact autour des champs, sans les espaces vides des options réservées aux vols.
- Le changement de service dans le hero ne lance plus de défilement de la page.
- Défilement à la molette lissé avec Lenis 1.3.17 embarqué localement, liens internes gérés par un seul contrôleur. Défilement tactile natif, sélecteurs et fenêtres exclus du lissage. Respect du réglage système de réduction des animations.

Photo hébergement créée avec le générateur intégré Imagegen, enregistrée dans `dist/assets/hero-stays.png`, optimisée dans `dist/assets/hero-stays.webp`.

Prompt hébergement :

> Use case: photorealistic-natural. Asset type: full bleed premium travel website accommodation hero photograph, landscape 16:9. Create an exceptionally beautiful realistic editorial architectural photograph of a serene luxury Mediterranean coastal hotel at blue hour. Low modern ivory stone and warm wood boutique resort buildings on the lower left and lower right, subtle warm interior lighting, a luminous still infinity pool leading toward the sea and distant mountains on the horizon. Restrained palms, white linen loungers, no people. Composition MUST leave upper 55 percent mostly open deep navy and royal blue evening sky, with a subtle peach horizon and all architecture and pool in the lower 45 percent; the middle/lower central region will be overlaid by a large white website search panel. Elegant aspirational travel photography, credible architecture and water reflections, rich blue palette harmonizing with a navy airplane wing website hero, no text, no logos, no lettering, no watermark, no UI. Wide landscape photograph.

## Démarrer

Prérequis : Node.js 22 ou supérieur. Aucune dépendance npm à installer.

```powershell
cd 'C:\Users\USER\Documents\New project\dz-fly'
npm start
```

Ouvrir http://127.0.0.1:4173. Ne pas ouvrir index.html directement via file:// : le site utilise des modules JavaScript.

```powershell
npm run check
```

## Ce qui fonctionne

- Accueil responsive, header transparent inspiré de la disposition Volz, logo fourni conservé sans retouche.
- Photo de hero originale créée pour DZ FLY, destinations illustrées.
- Français, anglais, arabe et mise en page de droite à gauche.
- Sélection et recherche parmi 24 aéroports, inversion du trajet.
- Aller simple, aller-retour, deux trajets, validation des dates.
- Compteurs adultes/enfants/bébés et classe, filtres direct/bagages.
- Recherche de démonstration vols et hébergements, tri.
- Préparation, sauvegarde, téléchargement et suppression des brouillons.
- Stockage navigateur, conservation après rechargement, recherche restaurée depuis l’URL.
- Aide, FAQ, menu, confidentialité et conditions adaptées à la version découverte.

## Limites de cette livraison

Les résultats sont des exemples fictifs explicitement signalés. Aucun fournisseur, paiement, compte client, service de livraison ou système d’émission n’est connecté. Les préférences de paiement sont indicatives. Les données sont locales au navigateur, sans synchronisation entre appareils. Aucun billet, PNR ou reçu de paiement réel n’est produit.

Le serveur livré sert les fichiers statiques pour l’aperçu local ; ce n’est pas le backend métier de production. Le dossier `dist` est le contenu à publier sur GitHub Pages. Aucun service fournisseur ni paiement n’est activé par cette publication.

## Branchement des fournisseurs

Avant la vente réelle, ajouter un backend séparé (sur VPS ou plateforme serveur) avec secrets côté serveur uniquement. Remplacer les fonctions d’exemples de `dist/domain.mjs` par les appels de ce backend. Ne jamais mettre les identifiants Amadeus, Travelgate ou de paiement dans le navigateur.

Le backend devra vérifier les prix, gérer les références fournisseurs et délais, réserver, traiter les confirmations de paiement signées et demander l’émission avec prévention des doublons. Conserver séparément les états commande, réservation, paiement, émission et livraison. Prévoir la reprise ou le remboursement après un paiement réussi suivi d’un échec d’émission.

Ajouter la base de données, l’authentification, l’administration, la gestion des accès, les sauvegardes et les conditions commerciales avant ouverture. Retirer `noindex` uniquement après validation de la publication commerciale.

## Vérification

- 6 tests métier réussis : dates, trajets, données d’URL, voyageurs, calculs et filtres.
- Contrôle dans Chrome du parcours recherche de vol → préparation → sauvegarde → rechargement → consultation → suppression du brouillon de test.
- Recherche d’hébergement contrôlée.
- Vérification visuelle desktop et mobile 390 × 844, y compris arabe RTL et absence de débordement horizontal.
- Images chargées avec succès ; serveur local HTTP 200.

## Images

Logo : fichier fourni par le client, copié dans `dist/assets/logo-original.png`, sans retouche.

Hero : générateur d’images intégré Imagegen (pas de CLI), sortie conservée dans `dist/assets/hero-sky.png` et version WebP optimisée `dist/assets/hero-sky.webp`.

Prompt utilisé :

> Use case: photorealistic-natural. Asset type: premium travel website hero background, landscape 1536x1024 or wider. Create an exquisite realistic photograph seen from an airplane window high above a sea of soft white cumulus clouds over the Mediterranean at blue hour just before sunset. A clean white aircraft wing rises from the lower left corner, pointing toward the middle right. Natural small warm sunlight highlights at the horizon, rich deep navy blue clear sky across the upper two thirds, luminous cyan haze at the horizon. Sophisticated editorial travel photography, credible aircraft proportions, fine atmospheric detail, inviting and serene. Composition: full bleed landscape, leave top and center mostly uncluttered deep blue sky for navigation and white headline and lower center covered by a website search panel. No text, logos, brand, lettering, watermark, window frame, UI, or graphic overlays.

Photos des destinations :
- Istanbul : https://images.unsplash.com/photo-1524231757912-21f4fe3a7200
- Paris : https://images.unsplash.com/photo-1502602898657-3e91760cbb34
- Bali : https://images.unsplash.com/photo-1537996194471-e657df975ab4
- Dubaï : https://images.unsplash.com/photo-1512453979798-5ea266f8880c

Police arabe : Noto Sans Arabic, fichier local distribué sous licence SIL Open Font License. Polices latines : DM Sans et Manrope via Google Fonts, avec repli Arial.
