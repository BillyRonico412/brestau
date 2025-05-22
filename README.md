# BRestau 🍔🍸 

https://brestau-app.ronico-billy.fr/

Bienvenue dans **BRestau**, une application web moderne et immersive conçue pour simuler la gestion d'un restaurant. Ce projet factice a été créé pour démontrer mes compétences en développement web full-stack, en mettant en avant des technologies modernes et des pratiques de développement robustes.

---

## 🌟 **Qu'est-ce que BRestau ?**

BRestau est une application qui permet de gérer les commandes d'un restaurant de manière fluide et intuitive. Voici ce que vous pouvez faire avec :

- **Pour les clients :** Parcourir les catégories de plats, sélectionner des sous-catégories, personnaliser les commandes (ingrédients, quantités) et passer commande.
- **Pour les cuisiniers :** Gérer les commandes en cours, marquer les plats comme "en préparation" ou "terminés".
- **Pour les administrateurs :** Gérer les catégories, sous-catégories, plats et ingrédients via une interface dédiée.
- **Paiements :** Intégration avec **Stripe** pour gérer les paiements en ligne de manière sécurisée et fluide.

L'application est conçue pour offrir une expérience utilisateur fluide, que ce soit sur mobile ou sur desktop.

---

## 🛠️ **Choix techniques et justifications**

### **Backend : TypeScript avec tRPC, Prisma et Stripe**
- **tRPC :**  
  tRPC est utilisé pour créer des API typesafe sans avoir besoin de schémas REST ou GraphQL. Cela simplifie la communication entre le frontend et le backend tout en garantissant une sécurité des types.
- **Prisma :**  
  Prisma est un ORM moderne qui facilite les interactions avec la base de données PostgreSQL. Il offre une autocomplétion et une gestion des migrations simplifiées.
- **Stripe :**  
  Stripe est intégré pour gérer les paiements en ligne. Il offre une API robuste et sécurisée, idéale pour les transactions financières.

### **Frontend : React avec TanStack Router**
- **TanStack Router :**  
  Une solution de routage puissante et flexible qui permet de gérer les routes de manière déclarative et typesafe. Cela garantit une navigation fluide et une gestion des états de route avancée.
- **shadcn :**  
  Une collection de composants UI construits sur Radix UI et stylisés avec Tailwind CSS. Cela permet de créer une interface utilisateur moderne et accessible.

### **Gestion des états : XState et React Query**
- **XState :**  
  Utilisé pour gérer les états complexes de l'application (comme les étapes de commande), XState garantit une logique claire et prévisible.
- **React Query :**  
  Une bibliothèque puissante pour la gestion des données asynchrones, utilisée pour synchroniser les données en temps réel entre le frontend et le backend.

### **Stockage des images : MinIO**
- **MinIO :**  
  MinIO est utilisé comme solution de stockage d'objets pour gérer les images de manière efficace et sécurisée. Il offre une compatibilité avec l'API S3, ce qui le rend facile à intégrer et à utiliser dans des environnements modernes.

### **Notifications et temps réel :**
- **EventEmitter :**  
  Utilisé pour gérer les événements en temps réel, comme les mises à jour des commandes, pour une expérience utilisateur fluide.

---

## 🚀 **Déploiement avec Coolify**

Le projet est déployé avec **Coolify**, une plateforme moderne et intuitive pour gérer les déploiements d'applications. Voici pourquoi Coolify a été choisi :

- **Simplicité :** Une interface utilisateur claire pour gérer les conteneurs Docker et les bases de données.
- **Support natif de Docker :** Le projet utilise des conteneurs Docker pour isoler les services (frontend, backend, base de données).
- **Automatisation :** Coolify permet de configurer des pipelines CI/CD pour déployer automatiquement les nouvelles versions.

### **Étapes de déploiement :**
1. **Configuration des conteneurs Docker :**  
   Les fichiers `Dockerfile` pour le frontend et le backend définissent les environnements d'exécution.
2. **Base de données PostgreSQL :**  
   Configurée via Coolify pour stocker les données de l'application.
3. **Déploiement continu :**  
   Chaque push sur la branche principale déclenche un déploiement automatique.

---

## 🎯 **Pourquoi ce projet ?**

BRestau est un projet factice, mais il reflète des scénarios réels de développement d'applications web modernes. Il met en avant mes compétences en :

- Conception et développement full-stack.
- Utilisation de technologies modernes et performantes.
- Déploiement et gestion d'applications en production.
- Intégration de solutions de paiement sécurisées avec Stripe.

Si vous êtes curieux ou souhaitez discuter de ce projet, n'hésitez pas à me contacter ! 😊
