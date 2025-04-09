
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Car } from 'lucide-react';
import { contactApi } from '@/services/api';
import { Textarea } from '@/components/ui/textarea';

const ContactForm = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    vehiculeId: '',
    vehiculeTitre: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if we have vehicule params in the URL
    const params = new URLSearchParams(location.search);
    const vehiculeId = params.get('vehicule');
    const vehiculeTitre = params.get('titre');
    
    if (vehiculeId) {
      setFormData(prev => ({ 
        ...prev, 
        vehiculeId,
        vehiculeTitre: vehiculeTitre || '',
        message: vehiculeTitre 
          ? `Je suis intéressé(e) par le véhicule: ${vehiculeTitre} (Réf: ${vehiculeId}). Merci de me contacter pour plus d'informations.`
          : prev.message
      }));
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Convert form data to the expected API format
      const contactData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      };
      
      console.log('Submitting contact form:', contactData);
      const response = await contactApi.submit(contactData);
      
      if (response.error) {
        throw new Error(response.message || 'Error submitting form');
      }
      
      toast({
        title: "Message envoyé!",
        description: "Nous vous contacterons dans les plus brefs délais.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        vehiculeId: '',
        vehiculeTitre: ''
      });
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi de votre message. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formData.vehiculeId && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <Car className="text-mercedes-blue h-5 w-5" />
            <div>
              <Label>Référence véhicule</Label>
              <p className="font-medium">{formData.vehiculeTitre || formData.vehiculeId}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom complet
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-mercedes-blue focus:border-mercedes-blue transition-colors"
            placeholder="Votre nom"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-mercedes-blue focus:border-mercedes-blue transition-colors"
            placeholder="votre@email.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Téléphone
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-mercedes-blue focus:border-mercedes-blue transition-colors"
          placeholder="+213 123 456 789"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <Label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </Label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-mercedes-blue focus:border-mercedes-blue transition-colors resize-none"
          placeholder="Votre message ici..."
          value={formData.message}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-mercedes-darkgray hover:bg-mercedes-black text-white py-3 rounded-md font-medium transition-colors"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Envoi en cours...
            </>
          ) : (
            'Envoyer le message'
          )}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
