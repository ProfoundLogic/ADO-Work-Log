import { useState, useEffect } from "react";
import { formatDates } from "../../utils";

export default function JobsRow({ job }) {
  const [segments, setSegments] = useState(0);

  useEffect(() => {
    fetch(`http://localhost/jobs/${job.id}`)
      .then((response) => response.json())
      .then((jobs) => {
        const totalSegments = job.segments;
        const completedSegments = jobs.length;
        const barWidth = (completedSegments / totalSegments) * 100;

        setSegments(barWidth);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <tr key={job.id} className="divide-x">
      <td className="whitespace-nowrap py-2 pl-2 pr-3 text-sm text-gray-500 text-left">
        {job.id}
      </td>
      <td className="whitespace-nowrap py-2 pl-2 pr-3 text-sm text-gray-500">
        {job.name}
      </td>
      <td className="whitespace-nowrap py-2 pl-3 pr-3 text-sm text-gray-500">
        <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
          <div
            className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
            style={{ width: `${segments}%` }}
          >
            {" "}
            {segments.toFixed(1)}%
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0 text-right">
        {formatDates(job.created)}
      </td>
    </tr>
  );
}
