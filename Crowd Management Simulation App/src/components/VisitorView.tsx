import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Clock, Users, MapPin, Coffee, Droplets, Info, Ticket } from 'lucide-react';

export function VisitorView() {
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <h2>Visitor Experience Portal</h2>
        <p className="text-muted-foreground">Public-facing information and services</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <h1 className="mb-2">Welcome to Heritage Temple</h1>
          <p className="text-muted-foreground mb-6">
            Plan your visit with real-time crowd information
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span>Currently: Low Crowd</span>
            </div>
            <Badge variant="outline" className="text-lg py-2 px-4">
              <Clock className="w-4 h-4 mr-2" />
              Best Time to Visit: Now
            </Badge>
          </div>

          <Button size="lg" className="mr-2">
            <Ticket className="w-4 h-4 mr-2" />
            Book E-Token
          </Button>
          <Button size="lg" variant="outline">
            Virtual Queue
          </Button>
        </Card>

        <div className="grid grid-cols-3 gap-4">
          <Card className="p-6 text-center">
            <Users className="w-12 h-12 mx-auto mb-3 text-green-600" />
            <p className="text-sm text-muted-foreground">Current Crowd Level</p>
            <p className="text-2xl mt-1">Low</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '35%' }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">35% capacity</p>
          </Card>

          <Card className="p-6 text-center">
            <Clock className="w-12 h-12 mx-auto mb-3 text-blue-600" />
            <p className="text-sm text-muted-foreground">Estimated Wait Time</p>
            <p className="text-2xl mt-1">8 mins</p>
            <p className="text-xs text-muted-foreground mt-3">At Sanctum entrance</p>
          </Card>

          <Card className="p-6 text-center">
            <MapPin className="w-12 h-12 mx-auto mb-3 text-purple-600" />
            <p className="text-sm text-muted-foreground">Available Parking</p>
            <p className="text-2xl mt-1">78%</p>
            <Badge variant="default" className="mt-3">Ample Space</Badge>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="mb-4">Recommended Visiting Times (Today)</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-green-600" />
                <div>
                  <p>7:00 AM - 9:00 AM</p>
                  <p className="text-sm text-muted-foreground">Peaceful morning hours</p>
                </div>
              </div>
              <Badge variant="default">Best</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950 rounded border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                  <p>2:00 PM - 4:00 PM</p>
                  <p className="text-sm text-muted-foreground">Moderate crowd expected</p>
                </div>
              </div>
              <Badge variant="secondary">Good</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950 rounded border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-red-600" />
                <div>
                  <p>4:00 PM - 7:00 PM</p>
                  <p className="text-sm text-muted-foreground">Peak hours - long wait times</p>
                </div>
              </div>
              <Badge variant="destructive">Busy</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4">Interactive Navigation Map</h3>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-64 flex items-center justify-center mb-4">
            <div className="text-center">
              <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Interactive map showing paths to:</p>
              <div className="flex gap-2 mt-3 justify-center flex-wrap">
                <Badge variant="outline">Sanctum</Badge>
                <Badge variant="outline">Rest Areas</Badge>
                <Badge variant="outline">Water Points</Badge>
                <Badge variant="outline">Exits</Badge>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <Button variant="outline" size="sm">
              <MapPin className="w-4 h-4 mr-2" />
              Sanctum
            </Button>
            <Button variant="outline" size="sm">
              <Coffee className="w-4 h-4 mr-2" />
              Rest Area
            </Button>
            <Button variant="outline" size="sm">
              <Droplets className="w-4 h-4 mr-2" />
              Water
            </Button>
            <Button variant="outline" size="sm">
              <Info className="w-4 h-4 mr-2" />
              Info Desk
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4">Virtual Queue System</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Book your time slot for darshan to avoid waiting in physical queues
          </p>
          <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" className="h-auto py-4 flex flex-col">
              <span>10:00 AM</span>
              <span className="text-xs text-muted-foreground mt-1">12 slots left</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col">
              <span>11:00 AM</span>
              <span className="text-xs text-muted-foreground mt-1">18 slots left</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col">
              <span>12:00 PM</span>
              <span className="text-xs text-muted-foreground mt-1">5 slots left</span>
            </Button>
            <Button variant="default" className="h-auto py-4 flex flex-col">
              <span>3:00 PM</span>
              <span className="text-xs mt-1">Available</span>
            </Button>
            <Button variant="default" className="h-auto py-4 flex flex-col">
              <span>4:00 PM</span>
              <span className="text-xs mt-1">Available</span>
            </Button>
            <Button variant="outline" disabled className="h-auto py-4 flex flex-col">
              <span>5:00 PM</span>
              <span className="text-xs text-muted-foreground mt-1">Full</span>
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
          <h3 className="mb-2">Sustainable Tourism Initiative</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Help us preserve this heritage site for future generations
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-600" />
              <span>Current visitor load: Sustainable</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-600" />
              <span>Site preservation: Excellent</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
