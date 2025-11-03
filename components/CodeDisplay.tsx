'use client';

interface CodeDisplayProps {
  code: string;
  highlightedLine?: number;
  highlightedLines?: number[];
}

export default function CodeDisplay({ code, highlightedLine, highlightedLines }: CodeDisplayProps) {
  const lines = code.split('\n');

  const getLineClass = (lineNumber: number) => {
    if (highlightedLines && highlightedLines.includes(lineNumber)) {
      return 'bg-yellow-200 border-l-4 border-yellow-500';
    }
    if (highlightedLine === lineNumber) {
      return 'bg-yellow-200 border-l-4 border-yellow-500';
    }
    return '';
  };

  return (
    <div className="mt-5 bg-gray-900 rounded-lg p-4 overflow-auto max-h-96">
      <pre className="text-sm">
        <code className="text-gray-300 font-mono">
          {lines.map((line, index) => (
            <div
              key={index}
              className={`px-2 py-1 transition-colors duration-300 ${getLineClass(index + 1)}`}
            >
              <span className="text-gray-500 select-none mr-4 w-8 inline-block text-right">
                {index + 1}
              </span>
              {line || '\u00A0'}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}


