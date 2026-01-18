import React, { useState } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Upload, Loader2, CheckCircle } from 'lucide-react';

const PackageUploader = ({ onComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const packageTemplates = [
    {
      package_name: "Kashmir Package",
      destination: "Srinagar - Sonamarg - Pahalgam - Gulmarg",
      duration: "5 nights and 6 days",
      itinerary: {
        day_1: "Pickup from Srinagar airport, Check-in hotel, freshen up and embark on a short trek to the Shankaracharya Hill. Afterwards, enjoy a picturesque Shikara ride on the famous Dal Lake and visit the Char Chinar Island. Continue the day with a thrilling speed boat ride on the lake, followed by a nature and photography tour at the lush Kashmiri gardens of Shalimar and Nishat Bagh. End the day with a night's stay in Srinagar.",
        day_2: "After breakfast, head to Sonamarg, known as the 'Meadow of Gold' for its vibrant flower valleys and serene lakes. Spend the day exploring tourist attractions such as the Baltal Valley, Satsar Lake, Thajiwas Glacier, Zoji-La Pass, Yusmarg, and Nilagrad River. After a refreshing day in the heart of the Himalayas, return to Srinagar for a night's stay.",
        day_3: "After breakfast, visit the picturesque destination of Gulmarg, known as the 'Meadow of Flowers'. Take the famous Gondola ride, which is one of the highest in the world, to the second phase Apharwat point. Enjoy playing in the snow and participate in skiing and snowboarding activities. End the day with a night's stay in a houseboat in Srinagar.",
        day_4: "After breakfast, depart for Pahalgam and stop to admire the saffron fields at Pampore. Take a photo opportunity at the apple valley and walnut plantations along the way. Upon arrival in Pahalgam, take a walking tour and take photos in the beautiful Aru valley. Stay the night in Pahalgam.",
        day_5: "After breakfast, head back to Srinagar, with a visit to the Avantipur ruins and a Kashmiri cricket bat factory along the way. Enjoy a free day in Srinagar and stay the night there.",
        day_6: "After breakfast, Srinagar airport drop"
      }
    },
    {
      package_name: "Kerala Package",
      destination: "Cochin - Munnar - Thekkady - Alleppey",
      duration: "5 nights and 6 days",
      itinerary: {
        day_1: "Pickup from Cochin railway station/airport check in hotel, after fresh up visit Marine Drive, Museum, LuLu Mall and night stay Cochin.",
        day_2: "After breakfast proceed to Munnar visit Rose Garden, Tea Garden, Elephant Park, Matupetty Dam, and Jeep Safari (Optional) night stay at Munnar.",
        day_3: "After breakfast Kallar Waterfall, Spice Garden, Chenkulam Dam, Wonder-Valley/Dream-Land Fun park (Optional), Hydel Park and night stay at Munnar.",
        day_4: "After breakfast proceed to Thekkady visit Boating at Periyar Wild life sanctuary , Spice Plantation shopping, Elephant Ride night stay at Thekkady.",
        day_5: "After breakfast proceed to Alleppey visit, Alleppey town beach, Shikhara Boating and Night stay at Alleppey Hotel.",
        day_6: "Kochi Railway Station/ Airport Drop."
      }
    },
    {
      package_name: "Shimla Manali",
      destination: "Delhi - Shimla - Manali - Delhi",
      duration: "5 nights and 6 days",
      itinerary: {
        day_1: "Pick up from Delhi/Chandigarh airport/railway station to Shimla and night stay at Shimla.",
        day_2: "Shimla, after breakfast full-day excursion to Kufri (one of the finest ski slopes), Mall Road, and other sightseeing, then a night stay at Shimla.",
        day_3: "After breakfast depart to Manali, on arrival check-in hotel, overnight stay at Manali.",
        day_4: "Full-day excursion to Rohtag pass, the gateway to Lahoul valley, Rahala falls, Solang valley, and Manali Mall Road. Overnight stay at Manali.",
        day_5: "Manali half-day sightseeing and proceed to Delhi/Chandigarh night stay.",
        day_6: "Delhi/Chandigarh airport/railway station drop."
      }
    },
    {
      package_name: "Ooty Coorg Honeymoon Package",
      destination: "Ooty - Coorg",
      duration: "4 nights and 5 days",
      itinerary: {
        day_1: "Pickup from Mysore railway station, proceed to coorg and night stay at Coorg.",
        day_2: "Coorg sightseeing visit abbey falls, raja seat, Dubre Elephant camp, etc and night stay at Coorg.",
        day_3: "Coorg to Ooty sightseeing, visit botanical garden, rose garden, Ooty lake and night stay at ooty.",
        day_4: "Coonur sightseeing visit Sim's Park, Dolphin's Nose, Lamb's Rock, etc and night stay at Mysore.",
        day_5: "Mysore railway station drop."
      }
    },
    {
      package_name: "Goa Package",
      destination: "Goa",
      duration: "2 nights and 3 days",
      itinerary: {
        day_1: "Pick up from Hubli/Thivim railway station & proceed to Goa, check in to the hotel, after fresh-up visit north Goa Mayem Lake, Mapusa Town, Anjuna, Calangute night stay at Goa.",
        day_2: "After breakfast in the hotel, proceed for south Goa sightseeing covering old Goa church, Dona Paula, Miramar Beach, Colva beach, Panjim Shopping, and overnight stay at a hotel in Goa.",
        day_3: "After breakfast proceeds to shopping & Hubli/Thivim railway station drop."
      }
    },
    {
      package_name: "Golden Triangle",
      destination: "Delhi - Agra - Jaipur - Ajmer",
      duration: "5 nights and 6 days",
      itinerary: {
        day_1: "Pickup from Agra railway station, check-in at the hotel, after fresh-up, visit Taj mahal, Agra fort, and night stay at Agra.",
        day_2: "After breakfast, proceed to Jaipur, visit Hawa mahal, city palace, museum, Jantar-mantar, Amber fort and night stay at Jaipur.",
        day_3: "After breakfast proceeds to Ajmer sharif, ziyarat of dargah sharif and night stay at Ajmer sharif.",
        day_4: "After breakfast, Sightseeing on own and night's stay at Ajmer sharif.",
        day_5: "Early morning proceed to Delhi by train from Ajmer sharif, pickup from Delhi railways station at 12:00 noon, check-in hotel, free time for shopping at evening by self, and night stay at Delhi.",
        day_6: "Delhi airport/railway station drop."
      }
    },
    {
      package_name: "Temple Cities",
      destination: "Madurai - Rameshwaram - Kanyakumari - Kodaikanal",
      duration: "3 nights and 4 days",
      itinerary: {
        day_1: "Pick up from Madurai railway station, Check in hotel, night stay at Madurai.",
        day_2: "Madurai Meenakshi temple darshan and proceed to Rameshwaram, visit pambam bridge, Ramnath swami temple, 22 well bath, sea bath, Sita tirth, Laxman tirth, floating stone and proceed to Kanyakumari night stay.",
        day_3: "Kanyakumari sightseeing: visit sunrise point, Swami Vivekanad memorial rock, Thiruvalluvar statue, Suchindrum temple, Triveni sangam & proceed to Madurai night stay.",
        day_4: "Madurai to Kodaikanal sightseeing, visit coakers walk, pillar walk, Green valley view, silver cascade waterfalls & back Madurai drop."
      }
    },
    {
      package_name: "Dandeli Package",
      destination: "Dandeli",
      duration: "1 night and 2 days",
      itinerary: {
        day_1: "Pickup from Hubli, proceed to Dandeli. Check-in resort. Visit Dandeli wildlife sanctuary, river rafting. Night stay at Dandeli.",
        day_2: "Morning nature walk, Syntheri Rocks visit, and Hubli drop."
      }
    },
    {
      package_name: "Mahabaleshwar Package",
      destination: "Mahabaleshwar - Lonavala",
      duration: "2 nights and 3 days",
      itinerary: {
        day_1: "Pickup from Pune railway station/airport, proceed to Mahabaleshwar. Visit viewpoints and night stay.",
        day_2: "Mahabaleshwar sightseeing - Venna Lake, Mapro Garden, Elephant's Head Point, and night stay.",
        day_3: "Proceed to Lonavala, visit Bhushi Dam, Tiger Point, and Pune drop."
      }
    }
  ];

  const handleUpload = async () => {
    setUploading(true);
    
    try {
      // Check if packages already exist
      const existingPackages = await getDocs(collection(db, 'packages'));
      
      if (existingPackages.size > 0) {
        if (!window.confirm('Packages already exist. Add anyway?')) {
          setUploading(false);
          return;
        }
      }

      // Add all packages
      for (const pkg of packageTemplates) {
        await addDoc(collection(db, 'packages'), pkg);
      }
      
      setSuccess(true);
      setUploading(false);
      
      // Notify parent to refresh
      setTimeout(() => {
        onComplete();
      }, 2000);
      
    } catch (err) {
      console.error('Error uploading packages:', err);
      alert('Failed to upload packages. Check console.');
      setUploading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <CheckCircle className="mx-auto mb-3" size={48} style={{color: '#16a34a'}} />
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          ✅ All 9 Packages Added Successfully!
        </h3>
        <p className="text-sm text-green-700">
          Refreshing in 2 seconds...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
      <Upload className="mx-auto mb-3" size={48} style={{color: '#2563eb'}} />
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Package Templates Not Found
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Click the button below to add 9 package templates to your database.
      </p>
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="px-6 py-3 rounded-lg font-medium text-white disabled:opacity-50 flex items-center justify-center space-x-2 mx-auto"
        style={{backgroundColor: '#eb3030'}}
      >
        {uploading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            <span>Uploading Packages...</span>
          </>
        ) : (
          <>
            <Upload size={20} />
            <span>Upload Package Templates</span>
          </>
        )}
      </button>
    </div>
  );
};

export default PackageUploader;
