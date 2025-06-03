import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { HelpCircle, Search, Send, FileText, Book, MessageSquare, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    email: '',
    subject: '',
    message: ''
  });
  const navigate = useNavigate();

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Support request submitted",
      description: "We'll get back to you as soon as possible.",
    });
    // Reset form
    setContactForm({
      email: '',
      subject: '',
      message: ''
    });
  };

  // Handle back button click
  const handleBackClick = () => {
    navigate('/');
  };

  // FAQ data organized by categories
  const faqCategories = {
    general: [
      {
        question: "What are AICTE points?",
        answer: "AICTE points are awarded to students for participating in various activities like workshops, seminars, competitions, internships, etc. VTU requires students to earn at least 100 AICTE points to be eligible for graduation."
      },
      {
        question: "How many AICTE points do I need to graduate?",
        answer: "As per VTU regulations, all students must earn at least 100 AICTE points to be eligible for graduation."
      },
      {
        question: "How can I earn AICTE points?",
        answer: "You can earn AICTE points by participating in various activities such as workshops, technical paper presentations, project exhibitions, community service, sports and cultural activities, internships, etc."
      }
    ],
    certificates: [
      {
        question: "How do I upload a certificate?",
        answer: "You can upload a certificate by going to the Certificates section, clicking on the 'Upload Certificate' button, filling in the required details, and attaching your certificate image or PDF."
      },
      {
        question: "How long does certificate verification take?",
        answer: "Certificate verification typically takes 2-3 business days. You will receive a notification once your certificate is verified and points are awarded."
      },
      {
        question: "What file formats are accepted for certificates?",
        answer: "We accept certificates in PDF, JPG, and PNG formats. The maximum file size allowed is 5MB."
      }
    ],
    account: [
      {
        question: "How do I reset my password?",
        answer: "To reset your password, click on 'Forgot Password' on the login page, enter your registered email address, and follow the instructions sent to your email."
      },
      {
        question: "Can I edit my profile information?",
        answer: "Yes, you can edit your profile information by going to the Profile section and clicking on the 'Edit Profile' button."
      },
      {
        question: "How do I update my email address?",
        answer: "To update your email address, go to your Profile, click on 'Edit Profile', enter your new email address, and save the changes. You will need to verify your new email address before the changes take effect."
      }
    ]
  };

  // Quick links
  const quickLinks = [
    { title: "How to Calculate AICTE Points", icon: FileText, url: "#calculate-points" },
    { title: "Certificate Upload Guide", icon: Book, url: "#certificate-upload" },
    { title: "Account Management", icon: MessageSquare, url: "#account-management" }
  ];

  useEffect(() => {
    if (window.location.hash) {
      const el = document.getElementById(window.location.hash.replace('#', ''));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return (
    <PageTransition>
      <div className="relative min-h-screen bg-white">
        <button
          className="fixed top-6 left-6 z-50 flex items-center gap-2 bg-white/80 hover:bg-white text-vtu-blue px-3 py-2 rounded-full shadow transition"
          onClick={handleBackClick}
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
        <main className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-vtu-primary mb-2">Help & Support</h1>
          <p className="text-muted-foreground mb-8">
            Find answers to common questions and get support with your VTU AICTE Tracker
          </p>
          {/* Search Box */}
          <Card className="mb-8">
            <CardContent className="pt-6 pb-8">
              <div className="text-center space-y-5">
                <HelpCircle className="h-14 w-14 text-vtu-primary mx-auto" />
                <h2 className="text-2xl font-semibold">How can we help you?</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Search our knowledge base or browse the categories below to find answers to your questions
                </p>
                <div className="flex w-full max-w-lg mx-auto">
                  <Input 
                    type="text" 
                    placeholder="Search for help topics..." 
                    className="rounded-r-none"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <Button className="rounded-l-none">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {quickLinks.map((link, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center">
                  <div className="bg-vtu-primary/10 p-3 rounded-full mr-4">
                    <link.icon className="h-6 w-6 text-vtu-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{link.title}</h3>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            ))}
          </div>
          {/* FAQs */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span>Frequently Asked Questions</span>
                <Badge variant="outline" className="ml-2">Popular</Badge>
              </CardTitle>
              <CardDescription>Find answers to common questions about AICTE points and the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="general">
                <TabsList className="mb-4">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="certificates">Certificates</TabsTrigger>
                  <TabsTrigger value="account">Account</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                  <Accordion type="single" collapsible className="w-full">
                    {faqCategories.general.map((faq, index) => (
                      <AccordionItem key={index} value={`general-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
                <TabsContent value="certificates">
                  <Accordion type="single" collapsible className="w-full">
                    {faqCategories.certificates.map((faq, index) => (
                      <AccordionItem key={index} value={`certificates-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
                <TabsContent value="account">
                  <Accordion type="single" collapsible className="w-full">
                    {faqCategories.account.map((faq, index) => (
                      <AccordionItem key={index} value={`account-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          <Separator className="my-8" />
          {/* Contact Support */}
          <div id="contact-support" className="scroll-mt-16">
            <h2 className="text-2xl font-bold mb-6">Contact Support</h2>
            <Card>
              <CardHeader>
                <CardTitle>Need More Help?</CardTitle>
                <CardDescription>
                  If you couldn't find what you're looking for, please fill out the form below and our support team will get back to you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Email</label>
                    <Input 
                      type="email" 
                      name="email"
                      value={contactForm.email}
                      onChange={handleFormChange}
                      placeholder="Enter your email address" 
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Subject</label>
                    <Input 
                      type="text" 
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleFormChange}
                      placeholder="What is your query about?" 
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Message</label>
                    <textarea 
                      name="message"
                      value={contactForm.message}
                      onChange={handleFormChange}
                      className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Describe your issue in detail"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Help;