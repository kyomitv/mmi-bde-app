# 📱 Application BDE MMI Dijon

Bienvenue sur le dépôt officiel de l'application mobile du BDE (Bureau des Étudiants) MMI Dijon. Cette application est destinée aux étudiants pour suivre l'actualité, accéder à leur carte adhérent et profiter des avantages partenaires.

<img width="1170" height="2376" alt="image" src="https://github.com/user-attachments/assets/b6d4a5aa-c5a0-4be4-a1ef-46cced47a17f" />
<img width="1170" height="2414" alt="image" src="https://github.com/user-attachments/assets/f34fb702-19e7-4c51-b4d0-a1f4cac394dc" />
<img width="1170" height="2407" alt="image" src="https://github.com/user-attachments/assets/2b95a12b-40d1-4f33-b62d-9b6e794f5e80" />
<img width="1170" height="2391" alt="image" src="https://github.com/user-attachments/assets/d0d9b235-8bb2-4a75-b98b-5615348de0b2" />

## ✨ Fonctionnalités

- **📰 Actualités** : Restez informé des derniers événements et annonces du BDE.
  - Système de likes en temps réel.
- **💳 Carte Adhérent** : Une carte membre numérique avec QR Code unique pour chaque étudiant.
- **🎁 Partenariats** : Liste et carte des partenaires offrant des réductions aux adhérents.
- **👤 Profil** : Gestion du profil utilisateur.

## 🛠 Stack Technique

- **Frontend** : [React Native](https://reactnative.dev/) avec [Expo](https://expo.dev/).
- **Backend** : [Supabase](https://supabase.com/) (PostgreSQL + Auth).
- **Navigation** : React Navigation.
- **UI/UX** : Expo Linear Gradient, Lucide Icons (via Ionicons).

## 🚀 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Node.js](https://nodejs.org/) (version LTS recommandée).
- [Expo Go](https://expo.dev/client) sur votre smartphone (iOS ou Android) pour tester l'application.

## 📥 Installation

1.  **Cloner le projet**

    ```bash
    git clone https://github.com/kyomitv/mmi-bde-app.git
    cd mmi-bde-app
    ```

2.  **Installer les dépendances**

    ```bash
    npm install
    # ou
    yarn install
    ```

## ⚙️ Configuration

L'application utilise Supabase comme backend. Vous devez configurer les variables d'environnement pour connecter l'application à votre projet Supabase.

1.  Renommez le fichier `.env.example` en `.env` (si disponible) ou créez un fichier `.env` à la racine du projet.
2.  Ajoutez vos clés Supabase :

    ```env
    EXPO_PUBLIC_SUPABASE_URL=votre_url_supabase
    EXPO_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
    ```

## 🏃‍♂️ Lancement

Pour lancer le serveur de développement :

```bash
npx expo start
```

- Scannez le QR code affiché dans le terminal avec l'application **Expo Go** (Android) ou l'application **Appareil photo** (iOS).
- Appuyez sur `a` pour ouvrir sur un émulateur Android ou `i` pour un simulateur iOS (nécessite une configuration supplémentaire).

## 🗄️ Structure de la Base de Données (Supabase)

Voici un aperçu des tables principales utilisées :

- **`profiles`** : Informations étendues des utilisateurs (liée à `auth.users`).
- **`news`** : Articles d'actualité.
  - `likes` : Tableau d'UUIDs (`uuid[]`) stockant les IDs des utilisateurs ayant liké.

## 🤝 Contribuer

Les contributions sont les bienvenues ! Pour des changements majeurs, veuillez d'abord ouvrir une issue pour discuter de ce que vous souhaitez changer.

1.  Formez le projet
2.  Créez votre branche de fonctionnalité (`git checkout -b feature/AmazingFeature`)
3.  Commitez vos changements (`git commit -m 'Add some AmazingFeature'`)
4.  Pushez sur la branche (`git push origin feature/AmazingFeature`)
5.  Ouvrez une Pull Request

## 📄 Licence
Projet open source. Développé par **kyomi**.
