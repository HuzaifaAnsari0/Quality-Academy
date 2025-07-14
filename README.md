# [Quality Academy](https://qualityacademy.info/)

Quality Academy is a robust web application designed to facilitate quiz creation and management while providing a resource-sharing platform. It combines features similar to Google Forms and resource management applications, making it a comprehensive solution for educators, trainers, and learners.

## Features

### 1. **Quiz Management**
- **Create Quizzes**: Users can design quizzes with customizable settings, including:
  - Public or private visibility.
  - Time limits for completion.
  - Question shuffling.
  - Allowing multiple attempts.
- **Questions**:
  - Supports single or multiple-choice questions.
  - Allows points assignment and optional explanations for answers.
- **Attempt Quizzes**: Users can attempt quizzes and receive immediate feedback with scores.

### 2. **Resource Management**
- **File Uploads**: Users can upload files such as images, videos, audio, PDFs, and more.
- **File Previews**: Dynamically displays previews based on file type.
- **Admin Controls**: Admin users can delete files and manage permissions.
- **Search & Sort**: Includes search and sorting functionality for easy access to resources.

### 3. **User Roles**
- **User**:
  - Create and attempt quizzes.
  - Access uploaded resources.
- **Admin**:
  - Manage all quizzes and resources.
  - Delete files and control file permissions.

## Technology Stack
- **Frontend**: React.js with Vite
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens) stored in localStorage

## Mongoose Models

### User Model
```javascript
{
  name: String,
  email: String,
  password: String,
  role: Number, // 0 = user, 1 = admin
  quizzesCreated: [{ type: Schema.Types.ObjectId, ref: 'Quiz' }],
  quizzesAttempted: [{ type: Schema.Types.ObjectId, ref: 'QuizResponse' }]
}
```

### Quiz Model
```javascript
{
  quiz_id: String,
  title: String,
  description: String,
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  questions: [QuestionSchema],
  settings: {
    isPublic: Boolean,
    timeLimit: Number,
    shuffleQuestions: Boolean,
    allowMultipleAttempts: Boolean
  }
}
```

### Question Schema (Embedded)
```javascript
{
  question: String,
  type: { type: String, default: "single" },
  options: [{
    optionText: String,
    isCorrect: Boolean
  }],
  points: { type: Number, default: 1 },
  explanation: String // Optional
}
```

### Quiz Response Model
```javascript
{
  quiz: { type: Schema.Types.ObjectId, ref: 'Quiz' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  answers: [{
    questionId: String,
    selectedOption: String,
    isCorrect: Boolean
  }],
  score: { type: Number, default: 0 },
  completedAt: { type: Date, default: Date.now }
}
```

## Installation

### Prerequisites
- Node.js
- MongoDB
- npm or yarn

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/HuzaifaAnsari0/Quality-Academy.git
   ```
2. Navigate to the project directory:
   ```bash
   cd quality-academy
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```
     PORT=5000
     MONGO_URI=<your-mongodb-connection-string>
     JWT_SECRET=<your-secret-key>
     ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Access the application at `http://localhost:5000`.

## Usage
- Sign up as a user to create or attempt quizzes.
- Admins can manage resources and quizzes via the admin dashboard.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user.
- `POST /api/auth/login` - Login with email and password.

### Quizzes
- `GET /api/quizzes` - Fetch all quizzes.
- `POST /api/quizzes` - Create a new quiz (Admin only).
- `GET /api/quizzes/:id` - Fetch a specific quiz.
- `POST /api/quizzes/:id/attempt` - Submit a quiz response.

### Resources
- `GET /api/resources` - Fetch all resources.
- `POST /api/resources` - Upload a resource.
- `DELETE /api/resources/:id` - Delete a resource (Admin only).

## Future Enhancements
- **Analytics**: Provide detailed insights for quiz creators.
- **Real-time Collaboration**: Allow multiple users to work on quiz creation simultaneously.
- **Gamification**: Introduce badges and leaderboards.
- **Mobile App**: Build a cross-platform mobile app.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature description"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contact
For any inquiries or support, feel free to contact:
- **Name**: Huzaifa Ansari
- **Email**: huzaifa.a@somaiya.edu
- **LinkedIn**: [linkedin.com/in/huzaifaansari0](www.linkedin.com/in/huzaifaansari0)
