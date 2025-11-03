import Link from 'next/link';

interface DataStructureCardProps {
  name: string;
  href: string;
  color: string;
  description: string;
}

export default function DataStructureCard({ name, href, color, description }: DataStructureCardProps) {
  return (
    <Link href={href}>
      <div 
        className="p-6 rounded-xl border-1 border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 bg-white hover:border-purple-300"
      >
        <div className="flex items-center mb-3">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3"
            style={{ backgroundColor: color }}
          >
            {name.charAt(0)}
          </div>
          <h3 className="text-xl font-bold text-gray-800">{name}</h3>
        </div>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
}


