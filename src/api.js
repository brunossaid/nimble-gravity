const BASE_URL =
  'https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net';

export async function getCandidateByEmail(email) {
  const res = await fetch(
    `${BASE_URL}/api/candidate/get-by-email?email=${encodeURIComponent(email)}`
  );

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(formatApiError(msg));
  }

  return res.json();
}

export async function getJobsList() {
  const res = await fetch(`${BASE_URL}/api/jobs/get-list`);

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(formatApiError(msg));
  }

  return res.json();
}

export async function applyToJob({
  uuid,
  jobId,
  candidateId,
  applicationId,
  repoUrl,
}) {
  const res = await fetch(`${BASE_URL}/api/candidate/apply-to-job`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uuid, jobId, candidateId, applicationId, repoUrl }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(formatApiError(msg));
  }

  return res.json();
}

function formatApiError(rawText) {
  try {
    const data = JSON.parse(rawText);

    const fieldErrors = data?.details?.fieldErrors;
    if (fieldErrors) {
      const key = Object.keys(fieldErrors)[0];
      const msg = fieldErrors[key]?.[0];
      if (key && msg) return `${key}: ${msg}`;
    }

    return data?.error || 'Request failed';
  } catch {
    return rawText || 'Request failed';
  }
}
