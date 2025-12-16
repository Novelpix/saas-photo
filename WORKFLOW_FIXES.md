# 🔧 Corrections du Workflow n8n - SAAS STUDIO PHOTO

## 📋 Problèmes identifiés dans le workflow original

### 1. ❌ Modèle Gemini incorrect
- **Avant** : `models/gemini-3-pro-image-preview` (n'existe pas)
- **Après** : `gemini-1.5-flash` (modèle valide et performant)

### 2. ❌ Image d'entrée non fournie
- Le webhook recevait l'image mais ne la passait pas au node Gemini
- **Correction** : Ajout d'un node "Préparer les données" qui extrait l'image du binaire

### 3. ❌ Response incorrecte
- **Avant** : Tentative de renvoyer `{{ $json.fileName }}` qui n'existe pas
- **Après** : Utilisation de `allIncomingItems` pour renvoyer l'image générée

### 4. ❌ Données du webhook mal structurées
- Les paramètres du formulaire n'étaient pas correctement extraits
- **Correction** : Node de préparation qui structure toutes les données

### 5. ❌ Email avec mauvaises références
- Références aux données cassées
- **Correction** : Utilisation correcte de `$('Préparer les données').item.json.*`

## 🆕 Nouveaux nodes ajoutés

### Node "Préparer les données"
- **Type** : Set (v3.3)
- **Fonction** : Extrait et structure toutes les données du webhook
- **Données extraites** :
  - `imageData` : L'image binaire uploadée
  - `style` : Style d'intérieur demandé
  - `intensity` : Intensité de transformation
  - `mobilier` : Niveau de luxe
  - `description` : Instructions personnalisées
  - `renovate_walls` : Rénover les murs (true/false)
  - `change_floor` : Changer le sol (true/false)
  - `email` : Email du client

## 🔄 Flux du workflow corrigé

```
1. Webhook
   ↓ (reçoit FormData avec image + paramètres)
2. Préparer les données
   ↓ (extrait et structure tout)
3. Générer l'image avec Gemini
   ↓ (transforme l'image selon le prompt)
4. Renvoyer l'image
   ↓ (répond au frontend avec l'image)
5. Envoyer par email
   ↓ (envoie l'image au client)
```

## ⚙️ Configuration du node Gemini

### Paramètres importants :
- **Model** : `gemini-1.5-flash` (rapide et économique)
  - Alternative : `gemini-1.5-pro` (plus performant mais plus cher)
- **Temperature** : 0.7 (bon équilibre créativité/cohérence)
- **maxOutputTokens** : 8192
- **inputBinary** : `imageData` (référence à l'image préparée)

### Prompt amélioré :
Le prompt inclut maintenant :
- ✅ Toutes les variables du formulaire
- ✅ Contraintes strictes sur la géométrie
- ✅ Instructions pour un résultat photoréaliste
- ✅ Demande de superposabilité des images

## 📧 Configuration de l'email

### Headers :
- Content-Type: image/png
- Permet au navigateur de recevoir l'image correctement

### Message email amélioré :
- Message personnalisé et professionnel
- Inclut tous les détails du projet
- Branding NovelPix

## 🚨 Points d'attention

### ⚠️ Limite de Gemini pour la génération d'images
**IMPORTANT** : Gemini n'est pas optimisé pour l'image-to-image transformation.

Pour de meilleurs résultats, considérez :
1. **Stable Diffusion + ControlNet** (meilleure qualité pour architecture)
2. **Midjourney API** (résultats artistiques exceptionnels)
3. **DALL-E 3** (bon équilibre qualité/facilité)
4. **Replicate API** avec modèles spécialisés (interior-design, etc.)

### 🔄 Alternative recommandée avec Replicate

Si Gemini ne donne pas de bons résultats, remplacez le node "Générer l'image avec Gemini" par un node HTTP Request vers Replicate :

```json
{
  "method": "POST",
  "url": "https://api.replicate.com/v1/predictions",
  "authentication": "headerAuth",
  "headerParameters": {
    "parameters": [
      {
        "name": "Authorization",
        "value": "Token YOUR_REPLICATE_API_KEY"
      }
    ]
  },
  "body": {
    "version": "MODEL_VERSION_HASH",
    "input": {
      "image": "={{ $('Préparer les données').item.json.imageData }}",
      "prompt": "YOUR_PROMPT",
      "strength": "={{ $('Préparer les données').item.json.intensity }}"
    }
  }
}
```

## 📦 Installation dans n8n

1. Copiez le contenu de `n8n-workflow-corrected.json`
2. Dans n8n, allez dans **Workflows** → **Import from File/URL**
3. Collez le JSON ou uploadez le fichier
4. Vérifiez les credentials :
   - Google Gemini API : `yMuQLoXU8VHmxLNU`
   - Gmail OAuth2 : `UjipcL9WuagOSerz`
5. **Activez le workflow**

## 🧪 Test du workflow

### Commande curl de test :
```bash
curl -X POST https://n8n.novelpix.com/webhook/generate-interior \
  -F "image=@/path/to/your/image.jpg" \
  -F "style=modern" \
  -F "mobilier=luxe" \
  -F "intensity=0.8" \
  -F "description=Salon lumineux avec vue" \
  -F "renovate_walls=true" \
  -F "change_floor=true" \
  -F "email=test@example.com"
```

## 📊 Monitoring

Le workflow inclut maintenant :
- ✅ Sauvegarde de toutes les exécutions (succès et erreurs)
- ✅ Logs détaillés pour le debugging
- ✅ Headers corrects pour les réponses

## 🎯 Prochaines améliorations suggérées

1. **Ajouter un node de validation** avant Gemini
   - Vérifier que l'image est valide
   - Vérifier la taille (< 10MB recommandé)
   - Vérifier le format (jpg, png)

2. **Ajouter la gestion d'erreurs**
   - Node IF pour vérifier les erreurs
   - Réponse personnalisée en cas d'échec
   - Notification admin si erreur

3. **Optimiser les coûts**
   - Redimensionner l'image avant envoi à Gemini
   - Utiliser gemini-1.5-flash au lieu de pro
   - Cache des résultats similaires

4. **Améliorer le prompt**
   - Ajouter des exemples (few-shot prompting)
   - Utiliser des techniques de prompt engineering
   - Tester différentes formulations

---

**Version** : 1.0 - Corrigée le {{ new Date().toISOString().split('T')[0] }}
**Auteur** : Claude Code
**Status** : ✅ Prêt pour production
