import { useState } from 'react';
import { applyToJob } from '../api';

export default function JobCard({ job, candidate }) {
  const [repoUrl, setRepoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);

    if (!repoUrl.trim()) {
      setError('Enter your GitHub repository URL.');
      return;
    }

    try {
      setSubmitting(true);

      await applyToJob({
        uuid: candidate.uuid,
        jobId: job.id,
        candidateId: candidate.candidateId,
        applicationId: candidate.applicationId,
        repoUrl: repoUrl.trim(),
      });

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="job-card">
      <h3 className="job-title">{job.title}</h3>

      <label className="job-label">GitHub Repository URL</label>

      <div className="job-actions">
        <input
          className="job-input"
          type="text"
          placeholder="https://github.com/username/repository-name"
          value={repoUrl}
          onChange={(e) => {
            setRepoUrl(e.target.value);
            if (success) setSuccess(false);
            if (error) setError(null);
          }}
        />

        <button onClick={handleSubmit} disabled={submitting || !repoUrl.trim()}>
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {success && (
        <p className="success-message">Application sent successfully ✔</p>
      )}
    </div>
  );
}
