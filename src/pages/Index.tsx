import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Indigenous Consultation Management</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Comprehensive platform for managing consultation processes
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/nation">
            <Button size="lg" className="w-full sm:w-auto">
              <CheckCircle className="mr-2 h-4 w-4" />
              Open Simplified Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/nation-demo">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              View All Dashboards
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
