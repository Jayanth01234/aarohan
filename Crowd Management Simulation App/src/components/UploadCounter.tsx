import { useState } from 'react';

type Result = {
  person_count: number;
  density: number;
  overcrowded: boolean;
  width: number;
  height: number;
} | null;

export function UploadCounter() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Result>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const form = new FormData();
      form.append('image', file);
      const res = await fetch('http://localhost:5000/api/cv/count', {
        method: 'POST',
        body: form,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      setError(e?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md space-y-3">
      <h4 className="font-medium">Image-based Crowd Counter</h4>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <div className="flex items-center gap-2">
        <button
          className="px-3 py-1.5 rounded bg-blue-600 text-white disabled:opacity-50"
          onClick={onUpload}
          disabled={!file || loading}
        >
          {loading ? 'Processing…' : 'Upload & Count'}
        </button>
        {error && <span className="text-red-600 text-sm">{error}</span>}
      </div>
      {result && (
        <div className="text-sm">
          <div>People: <b>{result.person_count}</b></div>
          <div>Density: <b>{result.density}</b></div>
          <div>Status: <b className={result.overcrowded ? 'text-red-600' : 'text-green-600'}>{result.overcrowded ? 'OVER-CROWDED' : 'SAFE'}</b></div>
          <div>Image: {result.width}x{result.height}</div>
        </div>
      )}
    </div>
  );
}
