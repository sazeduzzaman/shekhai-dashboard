{
  "success": true,
  "data": {
    "course": {
      "id": "string (course ID)",
      "title": "string (course title)",
      "shortDescription": "string (brief description)",
      "longDescription": "string (detailed description)",
      "category": [
        {
          "id": "string",
          "name": "string (category name)",
          "slug": "string (category slug)"
        }
      ],
      "level": "string (Beginner/Intermediate/Advanced)",
      "price": "number",
      "rating": "number (4.8)",
      "totalReviews": "number",
      "enrolledStudents": "number",
      "totalDuration": "number (hours)",
      "totalModules": "number",
      "totalLessons": "number",
      "bannerUrl": "string (image URL)",
      "thumbnails": ["array of image URLs"],
      "instructor": {
        "id": "string",
        "name": "string",
        "email": "string",
        "role": "string",
        "avatar": "string (image URL)",
        "bio": "string",
        "rating": "number",
        "totalStudents": "number",
        "totalCourses": "number"
      },
      "modules": [
        {
          "id": "string",
          "order": "number",
          "title": "string",
          "description": "string",
          "duration": "string (2h 15m)",
          "status": "string (completed/current/locked)",
          "lessons": [
            {
              "id": "string",
              "order": "number",
              "title": "string",
              "description": "string",
              "duration": "string (05:20)",
              "type": "string (video/practice/quiz/project)",
              "videoUrl": "string (video URL)",
              "thumbnail": "string (image URL)",
              "resources": [
                {
                  "id": "number",
                  "name": "string",
                  "type": "string (pdf/zip/markdown)",
                  "size": "string (2.4 MB)",
                  "url": "string (download URL)"
                }
              ],
              "completed": "boolean",
              "progress": "number (0-100)",
              "locked": "boolean",
              "quiz": {
                "id": "string",
                "title": "string",
                "description": "string",
                "totalQuestions": "number",
                "passingScore": "number",
                "duration": "string (15:00)"
              }
            }
          ],
          "quiz": {
            "id": "string",
            "title": "string",
            "description": "string",
            "totalQuestions": "number",
            "passingScore": "number",
            "duration": "string"
          }
        }
      ],
      "requirements": ["array of strings"],
      "whatYouWillLearn": ["array of strings"],
      "certificate": {
        "enabled": "boolean",
        "requirements": "string"
      },
      "language": "string",
      "subtitles": ["array of strings"],
      "access": "string (Lifetime)",
      "updates": "string",
      "support": "string",
      "projects": "number",
      "quizzes": "number",
      "assignments": "number"
    },
    "enrollment": {
      "id": "string",
      "courseId": "string",
      "studentInfo": {
        "name": "string",
        "email": "string",
        "phone": "string"
      },
      "progress": "number (0-100)",
      "status": "string (active/completed)",
      "certificateIssued": "boolean",
      "lastAccessed": "string (ISO date)",
      "enrollmentDate": "string (ISO date)",
      "paymentInfo": {
        "method": "string",
        "status": "string",
        "amount": "number",
        "paidAt": "string (ISO date)"
      }
    },
    "currentLesson": {
      "id": "string",
      "title": "string",
      "description": "string",
      "duration": "string",
      "type": "string",
      "videoUrl": "string",
      "resources": ["array of resource objects"],
      "completed": "boolean",
      "progress": "number"
    },
    "resources": [
      {
        "id": "number",
        "name": "string",
        "type": "string",
        "size": "string",
        "url": "string"
      }
    ],
    "discussions": [
      {
        "id": "string",
        "userId": "string",
        "userName": "string",
        "userAvatar": "string",
        "comment": "string",
        "timestamp": "string (ISO date)",
        "likes": "number",
        "replies": [
          {
            "id": "string",
            "userId": "string",
            "userName": "string",
            "userAvatar": "string",
            "comment": "string",
            "timestamp": "string (ISO date)",
            "likes": "number"
          }
        ]
      }
    ],
    "notes": [
      {
        "id": "string",
        "lessonId": "string",
        "content": "string",
        "timestamp": "string (ISO date)",
        "updatedAt": "string (ISO date)"
      }
    ],
    "quiz": {
      "id": "string",
      "title": "string",
      "description": "string",
      "totalQuestions": "number",
      "duration": "string",
      "questions": [
        {
          "id": "string",
          "question": "string",
          "options": [
            {
              "id": "string",
              "text": "string",
              "correct": "boolean"
            }
          ],
          "explanation": "string"
        }
      ],
      "attempts": [
        {
          "id": "string",
          "score": "number",
          "passed": "boolean",
          "completedAt": "string (ISO date)"
        }
      ]
    }
  }
}