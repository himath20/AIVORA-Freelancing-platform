import {
  FreelancerProfile,
  ClientProfile,
  AISkill,
  AIService,
  Project,
  Proposal,
  Assignment,
  Payment,
  Review,
  Complaint,
  ChartDataPoint,
} from "@/types";

// ─── Freelancers ───────────────────────────────────────────────────────────
export const freelancers: FreelancerProfile[] = [
  {
    id: "f1",
    userId: "u1",
    name: "Alex Johnson",
    avatar: "https://i.pravatar.cc/150?img=1",
    title: "AI/ML Engineer & Chatbot Specialist",
    bio: "Passionate about building intelligent systems. 5+ years crafting production-grade ML pipelines and conversational AI.",
    location: "San Francisco, USA",
    skills: ["Machine Learning", "Python", "NLP", "LangChain", "GPT APIs"],
    rating: 4.9,
    totalEarnings: 12450,
    completedProjects: 34,
    hourlyRate: 85,
    availability: "available",
    verified: true,
    memberSince: "Jan 2022",
  },
  {
    id: "f2",
    userId: "u2",
    name: "Priya Sharma",
    avatar: "https://i.pravatar.cc/150?img=5",
    title: "Data Scientist & AI Analyst",
    bio: "Turning raw data into strategic insights. Specialized in predictive analytics, computer vision, and AI dashboards.",
    location: "Bangalore, India",
    skills: ["Data Science", "TensorFlow", "React", "PowerBI", "Python"],
    rating: 4.8,
    totalEarnings: 9800,
    completedProjects: 28,
    hourlyRate: 65,
    availability: "busy",
    verified: true,
    memberSince: "Mar 2022",
  },
  {
    id: "f3",
    userId: "u3",
    name: "Marcus Wei",
    avatar: "https://i.pravatar.cc/150?img=8",
    title: "Computer Vision Expert",
    bio: "OpenCV, YOLO, and deep learning specialist with a track record in real-time object detection and facial recognition.",
    location: "Toronto, Canada",
    skills: ["Computer Vision", "OpenCV", "PyTorch", "YOLO", "FastAPI"],
    rating: 4.7,
    totalEarnings: 7200,
    completedProjects: 19,
    hourlyRate: 75,
    availability: "available",
    verified: false,
    memberSince: "Jun 2023",
  },
  {
    id: "f4",
    userId: "u4",
    name: "Sofia Reyes",
    avatar: "https://i.pravatar.cc/150?img=9",
    title: "AI Content & NLP Engineer",
    bio: "Building smart content pipelines with GPT-4, Claude, and fine-tuned models. Expert in RAG architectures.",
    location: "Madrid, Spain",
    skills: ["NLP", "GPT-4", "Claude", "RAG", "LangChain", "Node.js"],
    rating: 4.9,
    totalEarnings: 15600,
    completedProjects: 42,
    hourlyRate: 90,
    availability: "available",
    verified: true,
    memberSince: "Sep 2021",
  },
  {
    id: "f5",
    userId: "u5",
    name: "James Okafor",
    avatar: "https://i.pravatar.cc/150?img=12",
    title: "MLOps & AI Infrastructure Engineer",
    bio: "Deploying and scaling AI models with Kubernetes, MLflow, and cloud-native stacks. CI/CD for ML.",
    location: "Lagos, Nigeria",
    skills: ["MLOps", "Kubernetes", "Docker", "AWS SageMaker", "MLflow"],
    rating: 4.6,
    totalEarnings: 8900,
    completedProjects: 22,
    hourlyRate: 70,
    availability: "busy",
    verified: true,
    memberSince: "Nov 2022",
  },
];

// ─── Clients ──────────────────────────────────────────────────────────────
export const clients: ClientProfile[] = [
  {
    id: "c1",
    userId: "u10",
    organizationName: "TechCorp Ltd.",
    logo: "https://i.pravatar.cc/150?img=20",
    industry: "SaaS / Enterprise Software",
    location: "New York, USA",
    website: "https://techcorp.example.com",
    totalSpent: 45000,
    projectsPosted: 12,
    memberSince: "Feb 2022",
    verified: true,
  },
  {
    id: "c2",
    userId: "u11",
    organizationName: "DataVision AI",
    logo: "https://i.pravatar.cc/150?img=21",
    industry: "AI Research",
    location: "London, UK",
    website: "https://datavision.example.com",
    totalSpent: 32000,
    projectsPosted: 8,
    memberSince: "May 2022",
    verified: true,
  },
  {
    id: "c3",
    userId: "u12",
    organizationName: "RetailGenius",
    logo: "https://i.pravatar.cc/150?img=22",
    industry: "E-commerce",
    location: "Singapore",
    website: "https://retailgenius.example.com",
    totalSpent: 18500,
    projectsPosted: 5,
    memberSince: "Aug 2023",
    verified: false,
  },
];

// ─── AI Skills ────────────────────────────────────────────────────────────
export const aiSkills: AISkill[] = [
  { id: "s1", name: "Machine Learning", category: "AI/ML", description: "Build, train and deploy ML models for classification, regression and clustering.", demandLevel: "high", avgRate: 80 },
  { id: "s2", name: "Natural Language Processing", category: "AI/ML", description: "Text understanding, sentiment analysis, entity extraction and language generation.", demandLevel: "high", avgRate: 85 },
  { id: "s3", name: "Computer Vision", category: "AI/ML", description: "Image recognition, object detection, segmentation and visual AI.", demandLevel: "high", avgRate: 78 },
  { id: "s4", name: "LangChain / RAG", category: "GenAI", description: "Retrieval-augmented generation pipelines using LangChain and vector databases.", demandLevel: "high", avgRate: 95 },
  { id: "s5", name: "GPT / LLM Integration", category: "GenAI", description: "Integrating OpenAI, Anthropic, Gemini and open-source LLMs into applications.", demandLevel: "high", avgRate: 90 },
  { id: "s6", name: "MLOps", category: "Infrastructure", description: "Model deployment, monitoring, CI/CD pipelines for ML systems.", demandLevel: "medium", avgRate: 72 },
  { id: "s7", name: "Data Engineering", category: "Data", description: "ETL pipelines, data lakes, Spark, Airflow and cloud data platforms.", demandLevel: "medium", avgRate: 70 },
  { id: "s8", name: "AI Chatbot Development", category: "GenAI", description: "Designing and deploying intelligent conversational agents.", demandLevel: "high", avgRate: 75 },
  { id: "s9", name: "Predictive Analytics", category: "Data", description: "Forecasting, time-series analysis and business intelligence.", demandLevel: "medium", avgRate: 68 },
  { id: "s10", name: "Reinforcement Learning", category: "AI/ML", description: "RL agents for game AI, robotics and recommendation systems.", demandLevel: "low", avgRate: 100 },
];

// ─── AI Services ──────────────────────────────────────────────────────────
export const aiServices: AIService[] = [
  { id: "sv1", title: "Custom AI Chatbot for Your Website", freelancerId: "f1", freelancerName: "Alex Johnson", freelancerAvatar: "https://i.pravatar.cc/150?img=1", category: "AI Chatbot", description: "I will build a fully customized AI chatbot integrated with your website using GPT-4.", price: 499, deliveryDays: 7, rating: 4.9, reviews: 42, tags: ["GPT-4", "Chatbot", "NLP"], status: "active" },
  { id: "sv2", title: "AI-Powered Data Analytics Dashboard", freelancerId: "f2", freelancerName: "Priya Sharma", freelancerAvatar: "https://i.pravatar.cc/150?img=5", category: "Data Science", description: "Full analytics dashboard with ML-driven insights and interactive charts.", price: 799, deliveryDays: 10, rating: 4.8, reviews: 28, tags: ["Dashboard", "ML", "React"], status: "active" },
  { id: "sv3", title: "Object Detection Model (YOLO)", freelancerId: "f3", freelancerName: "Marcus Wei", freelancerAvatar: "https://i.pravatar.cc/150?img=8", category: "Computer Vision", description: "Train and deploy a custom YOLO-based object detection model on your dataset.", price: 649, deliveryDays: 14, rating: 4.7, reviews: 15, tags: ["YOLO", "OpenCV", "Python"], status: "active" },
  { id: "sv4", title: "RAG Pipeline with LangChain", freelancerId: "f4", freelancerName: "Sofia Reyes", freelancerAvatar: "https://i.pravatar.cc/150?img=9", category: "GenAI", description: "Build a production-ready RAG system for document Q&A using LangChain and Pinecone.", price: 999, deliveryDays: 12, rating: 4.9, reviews: 56, tags: ["LangChain", "RAG", "GPT-4"], status: "active" },
  { id: "sv5", title: "MLOps Pipeline Setup on AWS", freelancerId: "f5", freelancerName: "James Okafor", freelancerAvatar: "https://i.pravatar.cc/150?img=12", category: "MLOps", description: "Full CI/CD and monitoring pipeline for your ML models using AWS SageMaker and MLflow.", price: 1199, deliveryDays: 21, rating: 4.6, reviews: 19, tags: ["AWS", "MLflow", "Docker"], status: "active" },
  { id: "sv6", title: "Sentiment Analysis API", freelancerId: "f1", freelancerName: "Alex Johnson", freelancerAvatar: "https://i.pravatar.cc/150?img=1", category: "NLP", description: "Production-grade REST API for real-time sentiment and emotion analysis.", price: 349, deliveryDays: 5, rating: 4.8, reviews: 33, tags: ["NLP", "FastAPI", "Python"], status: "active" },
];

// ─── Projects ─────────────────────────────────────────────────────────────
export const projects: Project[] = [
  { id: "p1", title: "Build an AI-Powered Analytics Dashboard", clientId: "c1", clientName: "TechCorp Ltd.", clientLogo: "https://i.pravatar.cc/150?img=20", description: "We need a comprehensive analytics dashboard with AI-driven insights, real-time data, and beautiful visualizations.", requiredSkills: ["React", "Data Science", "ML"], budget: 3000, budgetType: "fixed", deadline: "2025-07-15", status: "open", proposals: 8, postedAt: "2025-06-10", category: "Data Science" },
  { id: "p2", title: "Create a Chatbot for E-commerce", clientId: "c3", clientName: "RetailGenius", clientLogo: "https://i.pravatar.cc/150?img=22", description: "Build an AI chatbot for our e-commerce platform to handle customer queries, order tracking, and product recommendations.", requiredSkills: ["AI", "NLP", "Python"], budget: 2000, budgetType: "fixed", deadline: "2025-07-07", status: "in_progress", proposals: 12, postedAt: "2025-06-05", category: "AI Chatbot" },
  { id: "p3", title: "Develop a Computer Vision Model", clientId: "c2", clientName: "DataVision AI", clientLogo: "https://i.pravatar.cc/150?img=21", description: "We require a computer vision model for real-time defect detection on a manufacturing production line.", requiredSkills: ["AI", "Python", "OpenCV", "YOLO"], budget: 2500, budgetType: "fixed", deadline: "2025-07-02", status: "open", proposals: 5, postedAt: "2025-06-08", category: "Computer Vision" },
  { id: "p4", title: "AI Content Generation Platform", clientId: "c1", clientName: "TechCorp Ltd.", clientLogo: "https://i.pravatar.cc/150?img=20", description: "An AI content generation platform for marketing teams to generate SEO-optimized blogs, social posts and ads.", requiredSkills: ["GPT-4", "LangChain", "React", "Node.js"], budget: 5000, budgetType: "fixed", deadline: "2025-08-01", status: "open", proposals: 15, postedAt: "2025-06-12", category: "GenAI" },
  { id: "p5", title: "ML Model for Churn Prediction", clientId: "c2", clientName: "DataVision AI", clientLogo: "https://i.pravatar.cc/150?img=21", description: "Build and deploy a customer churn prediction model integrated with our CRM via REST API.", requiredSkills: ["Machine Learning", "Python", "FastAPI"], budget: 1800, budgetType: "fixed", deadline: "2025-07-20", status: "completed", proposals: 9, postedAt: "2025-05-15", category: "Data Science" },
  { id: "p6", title: "Voice Assistant Integration", clientId: "c3", clientName: "RetailGenius", clientLogo: "https://i.pravatar.cc/150?img=22", description: "Integrate a voice AI assistant into our mobile app for hands-free shopping experience.", requiredSkills: ["NLP", "Speech Recognition", "React Native"], budget: 3500, budgetType: "fixed", deadline: "2025-08-15", status: "open", proposals: 3, postedAt: "2025-06-14", category: "AI Voice" },
];

// ─── Proposals ────────────────────────────────────────────────────────────
export const proposals: Proposal[] = [
  { id: "pr1", projectId: "p1", projectTitle: "Build an AI-Powered Analytics Dashboard", freelancerId: "f2", freelancerName: "Priya Sharma", freelancerAvatar: "https://i.pravatar.cc/150?img=5", coverLetter: "I have 5 years of experience building data-driven dashboards with React and ML backends. I've completed 28 similar projects and have a 4.8 star rating.", bidAmount: 2800, deliveryDays: 12, status: "pending", submittedAt: "2025-06-11" },
  { id: "pr2", projectId: "p2", projectTitle: "Create a Chatbot for E-commerce", freelancerId: "f1", freelancerName: "Alex Johnson", freelancerAvatar: "https://i.pravatar.cc/150?img=1", coverLetter: "Chatbot development is my specialty. I've built 15+ production chatbots using GPT-4 and NLP. This project is a perfect fit.", bidAmount: 1900, deliveryDays: 10, status: "accepted", submittedAt: "2025-06-06" },
  { id: "pr3", projectId: "p4", projectTitle: "AI Content Generation Platform", freelancerId: "f4", freelancerName: "Sofia Reyes", freelancerAvatar: "https://i.pravatar.cc/150?img=9", coverLetter: "I specialize in LangChain and GPT-4 content pipelines. I can deliver a production-ready platform that scales for your marketing team.", bidAmount: 4800, deliveryDays: 25, status: "pending", submittedAt: "2025-06-13" },
  { id: "pr4", projectId: "p3", projectTitle: "Develop a Computer Vision Model", freelancerId: "f3", freelancerName: "Marcus Wei", freelancerAvatar: "https://i.pravatar.cc/150?img=8", coverLetter: "Computer vision for manufacturing defect detection is exactly my domain. I have 3 previous projects in industrial CV.", bidAmount: 2300, deliveryDays: 18, status: "rejected", submittedAt: "2025-06-09" },
  { id: "pr5", projectId: "p5", projectTitle: "ML Model for Churn Prediction", freelancerId: "f2", freelancerName: "Priya Sharma", freelancerAvatar: "https://i.pravatar.cc/150?img=5", coverLetter: "Churn prediction is a core skill of mine. I'll deliver a well-documented model with FastAPI integration.", bidAmount: 1700, deliveryDays: 14, status: "accepted", submittedAt: "2025-05-16" },
];

// ─── Assignments ──────────────────────────────────────────────────────────
export const assignments: Assignment[] = [
  { id: "a1", projectId: "p2", projectTitle: "Create a Chatbot for E-commerce", freelancerId: "f1", freelancerName: "Alex Johnson", clientId: "c3", clientName: "RetailGenius", startDate: "2025-06-08", endDate: "2025-07-07", budget: 1900, status: "active", progress: 65 },
  { id: "a2", projectId: "p5", projectTitle: "ML Model for Churn Prediction", freelancerId: "f2", freelancerName: "Priya Sharma", clientId: "c2", clientName: "DataVision AI", startDate: "2025-05-20", endDate: "2025-06-25", budget: 1700, status: "completed", progress: 100 },
];

// ─── Payments ─────────────────────────────────────────────────────────────
export const payments: Payment[] = [
  { id: "pay1", projectId: "p2", projectTitle: "E-commerce Chatbot", fromId: "c3", fromName: "RetailGenius", toId: "f1", toName: "Alex Johnson", amount: 950, status: "completed", method: "Stripe", date: "2025-06-15" },
  { id: "pay2", projectId: "p5", projectTitle: "ML Churn Prediction", fromId: "c2", fromName: "DataVision AI", toId: "f2", toName: "Priya Sharma", amount: 1700, status: "completed", method: "PayPal", date: "2025-06-28" },
  { id: "pay3", projectId: "p1", projectTitle: "AI Analytics Dashboard", fromId: "c1", fromName: "TechCorp Ltd.", toId: "f2", toName: "Priya Sharma", amount: 1500, status: "pending", method: "Bank Transfer", date: "2025-07-01" },
  { id: "pay4", projectId: "p4", projectTitle: "AI Content Platform", fromId: "c1", fromName: "TechCorp Ltd.", toId: "f4", toName: "Sofia Reyes", amount: 2400, status: "failed", method: "Stripe", date: "2025-06-30" },
];

// ─── Reviews ──────────────────────────────────────────────────────────────
export const reviews: Review[] = [
  { id: "r1", projectId: "p5", projectTitle: "ML Churn Prediction", reviewerId: "c2", reviewerName: "DataVision AI", reviewerAvatar: "https://i.pravatar.cc/150?img=21", revieweeId: "f2", rating: 5, comment: "Priya delivered exceptional work. The model exceeded our accuracy expectations and the FastAPI integration was seamless.", date: "2025-07-01" },
  { id: "r2", projectId: "p2", projectTitle: "E-commerce Chatbot", reviewerId: "c3", reviewerName: "RetailGenius", reviewerAvatar: "https://i.pravatar.cc/150?img=22", revieweeId: "f1", rating: 5, comment: "Alex built a world-class chatbot. Customer satisfaction went up 30% in the first week!", date: "2025-07-05" },
  { id: "r3", projectId: "p5", projectTitle: "ML Churn Prediction", reviewerId: "f2", reviewerName: "Priya Sharma", reviewerAvatar: "https://i.pravatar.cc/150?img=5", revieweeId: "c2", rating: 4, comment: "Great client. Clear requirements and prompt communication. Would work with again.", date: "2025-07-01" },
];

// ─── Complaints ───────────────────────────────────────────────────────────
export const complaints: Complaint[] = [
  { id: "comp1", projectId: "p3", projectTitle: "Computer Vision Model", raisedBy: "DataVision AI", raisedByRole: "client", against: "Marcus Wei", reason: "Deliverable did not match agreed specifications. Model accuracy was significantly below the 95% target.", status: "investigating", raisedAt: "2025-06-25" },
  { id: "comp2", projectId: "p4", projectTitle: "AI Content Platform", raisedBy: "Sofia Reyes", raisedByRole: "freelancer", against: "TechCorp Ltd.", reason: "Payment failed and client is unresponsive to communication attempts for 5 days.", status: "open", raisedAt: "2025-07-01" },
];

// ─── Chart Data ───────────────────────────────────────────────────────────
export const earningsChartData: ChartDataPoint[] = [
  { month: "Jan", value: 2000 },
  { month: "Feb", value: 3200 },
  { month: "Mar", value: 2800 },
  { month: "Apr", value: 4100 },
  { month: "May", value: 3600 },
  { month: "Jun", value: 7250 },
];

export const revenueChartData: ChartDataPoint[] = [
  { month: "Jan", value: 12000, secondary: 8000 },
  { month: "Feb", value: 18000, secondary: 12000 },
  { month: "Mar", value: 15000, secondary: 10000 },
  { month: "Apr", value: 24000, secondary: 16000 },
  { month: "May", value: 21000, secondary: 14000 },
  { month: "Jun", value: 32000, secondary: 22000 },
];

export const projectsChartData: ChartDataPoint[] = [
  { month: "Jan", value: 8 },
  { month: "Feb", value: 14 },
  { month: "Mar", value: 11 },
  { month: "Apr", value: 18 },
  { month: "May", value: 15 },
  { month: "Jun", value: 22 },
];
