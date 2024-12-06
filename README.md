# SpotAuth-Lite: Full Stack Application

**SpotAuth-Lite** is a full stack web application designed to validate music uploads before they are added to Spotify's catalog. This project demonstrates how Spotify can implement a service to detect **AI-generated tracks**, **duplicate content**, and **metadata mismatches**, ensuring the integrity of its music catalog. The system combines a user-friendly frontend with a robust backend to simulate real-world functionality.

---

## **Features**

- **Uploader Authentication**: Authenticate users via Spotify OAuth or mock credentials.
- **Metadata Verification**: Compare uploaded track metadata against a predefined catalog or Spotify's live API.
- **AI Content Detection**: Analyze uploaded audio files for AI-generated properties.
- **Fraud Detection**: Identify duplicate tracks in the catalog.
- **Result Logging**: Generate and store validation reports for transparency and future review.

---

## **Tech Stack**

- **Frontend**: Next.js, TailwindCSS
- **Backend**: Node.js, Express.js
- **APIs**:
  - Spotify Web API (for metadata and user authentication)
  - Mocked AI detection logic
- **Deployment**: Vercel

---

## **Getting Started**

### **Prerequisites**
- **Spotify Developer Account**: Create an app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
- **Node.js**: Ensure Node.js is installed.

### **Installation**
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/spotauth-lite.git
   cd spotauth-lite
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory:
     ```plaintext
     NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
     NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
     NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/verify
     ```
   - Add any mock credentials as needed for testing.

4. Run the application:
   ```bash
   npm run dev
   ```

---

## **Frontend Workflow**

1. **Authenticate Uploader**
   - Users log in using Spotify credentials.
   - Upon successful login, users are redirected to the upload dashboard.

2. **Submit Metadata**
   - Users input track details such as title, artist name, and duration.
   - Optionally, users upload an audio file for AI analysis.

3. **View Results**
   - The system displays validation results:
     - Metadata matches or mismatches.
     - AI-generated content detection.
     - Duplicate content flags.

---

## **Backend Workflow**

1. **Metadata Verification**
   - Endpoint: `/verify-metadata`
   - Process:
     - Validate metadata against a dummy catalog or Spotify’s API.
     - Example Input:
       ```json
       {
         "title": "Ocean Waves",
         "artist": "DJ Bliss",
         "duration": "3:45"
       }
       ```
     - Example Output:
       ```json
       {
         "valid": true,
         "message": "Track validated successfully."
       }
       ```

2. **AI Content Detection**
   - Endpoint: `/detect-ai`
   - Process:
     - Analyze uploaded audio properties.
     - Mock logic flags content as AI-generated based on patterns.

3. **Uploader Authentication**
   - Endpoint: `/auth`
   - Process:
     - Validate credentials via Spotify OAuth or mock user data.
     - Example Input:
       ```json
       {
         "username": "uploader1",
         "password": "key123"
       }
       ```
     - Example Output:
       ```json
       {
         "authenticated": true,
         "message": "Authentication successful."
       }
       ```

---

## **Why SpotAuth-Lite Matters**

- **AI Content Detection**: Prevents unauthorized or fraudulent AI-generated tracks from polluting Spotify's catalog.
- **Metadata Integrity**: Ensures accurate metadata, avoiding duplicate or mismatched entries.
- **Seamless Integration**: Demonstrates how Spotify could integrate this service into its upload pipeline for artists.

---

## **Future Enhancements**

- **Spotify Integration**: Fully integrate Spotify Web API for live catalog validation.
- **AI Model Integration**: Use advanced AI models to detect complex AI-generated content.
- **Admin Dashboard**: Add features for Spotify admins to review flagged tracks.

---

## **License**

MIT License - feel free to use this project for learning and development.
