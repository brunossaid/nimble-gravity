import { useEffect, useState } from 'react';
import { getCandidateByEmail, getJobsList } from './api';
import JobCard from './components/JobCard';

const email = 'ibrunosaid@gmail.com';

export default function App() {
  const [candidate, setCandidate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const [candidateData, jobsData] = await Promise.all([
          getCandidateByEmail(email),
          getJobsList(),
        ]);

        // console.log('candidate:', candidateData);
        // console.log('jobs:', jobsData);

        setCandidate(candidateData);
        setJobs(jobsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div>
      <h1>Nimble Gravity Challenge</h1>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {!loading && !error && !candidate && <p>Candidate not loaded.</p>}

      {candidate && (
        <div className="candidate-info">
          <p className="candidate-name">
            {candidate.firstName} {candidate.lastName}
          </p>
          <p className="candidate-email">{candidate.email}</p>
        </div>
      )}

      {candidate && (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} candidate={candidate} />
          ))}
        </div>
      )}
    </div>
  );
}
