// components/Auth/SelectCompany.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { useHrSwitchCompanyMutation } from "@/rtk/Auth/AuthApi";
import { Building2, ChevronRight, Briefcase, Check, Loader2, ArrowLeft, Users, Building, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface Company {
  companyId: string;
  companyName: string;
  companyLogo?: string;
  staffId: string;
}

interface SelectCompanyProps {
  companies: Company[];
  onBack: () => void;
}

export const SelectCompany: React.FC<SelectCompanyProps> = ({ companies, onBack }) => {
  const navigate = useNavigate();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [switchCompany, { isLoading }] = useHrSwitchCompanyMutation();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [hoveredCompanyId, setHoveredCompanyId] = useState<string | null>(null);

  const saveLoginData = (res: any) => {
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.data));
    localStorage.setItem("company", res.data.companyId);
    localStorage.setItem(
      "location",
      JSON.stringify(res.data.groupId?.locationId || null),
    );
    localStorage.setItem("group", JSON.stringify(res.data.groupId || null));
  };

  const handleSelectCompany = async (staffId: string, companyId: string) => {
    setSelectedCompanyId(companyId);
    
    try {
      const res = await switchCompany({
        staffId,
        companyId,
      }).unwrap();

      if (res.token && res.data) {
        saveLoginData(res);
        toast.success(`Welcome to ${res.data.companyName || 'your company'}`);
        navigate("/");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to switch company");
      setSelectedCompanyId(null);
    }
  };

  const handleImageError = (companyId: string) => {
    setImageErrors(prev => ({ ...prev, [companyId]: true }));
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" }
    })
  };

  const truncateName = (name: string, maxLength: number) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + '...';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  };

  const getCompanyColor = (name: string) => {
    const colors = [
      'from-blue-50 to-blue-100 text-blue-600',
      'from-indigo-50 to-indigo-100 text-indigo-600',
      'from-sky-50 to-sky-100 text-sky-600',
      'from-cyan-50 to-cyan-100 text-cyan-600',
      'from-violet-50 to-violet-100 text-violet-600',
      'from-blue-50 to-sky-100 text-blue-600',
      'from-indigo-50 to-blue-100 text-indigo-600',
      'from-sky-50 to-cyan-100 text-sky-600',
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative"
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">Back</span>
          </button>
          
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-4 py-1.5 text-xs font-medium text-blue-700 backdrop-blur-sm">
            <Building2 className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">Company</span> Selection
          </div>
          
          <div className="w-20 sm:w-24" />
        </div>

        {/* Title Section */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-white shadow-sm ring-1 ring-blue-100">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Select Your Company
          </h2>
          
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
            Choose the company you want to access
          </p>
          
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-xs font-medium text-slate-600">
            <Building className="h-3.5 w-3.5" />
            {companies.length} {companies.length !== 1 ? 'companies' : 'company'} available
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 gap-3">
          {companies.map((company, index) => {
            const hasImageError = imageErrors[company.companyId];
            const hasLogo = company.companyLogo && !hasImageError;
            const isHovered = hoveredCompanyId === company.companyId;
            const isSelected = selectedCompanyId === company.companyId;
            const isLoadingCompany = isSelected && isLoading;
            
            return (
              <motion.button
                key={company.companyId}
                custom={index}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectCompany(company.staffId, company.companyId)}
                onMouseEnter={() => setHoveredCompanyId(company.companyId)}
                onMouseLeave={() => setHoveredCompanyId(null)}
                disabled={isLoading}
                className={`
                  relative flex items-center gap-4 rounded-xl border-2 p-4 text-left
                  transition-all duration-200 w-full
                  ${isLoadingCompany
                    ? 'border-blue-500 bg-blue-50/50 shadow-[0_0_0_4px_rgba(37,99,235,0.1)]'
                    : isSelected
                    ? 'border-emerald-500 bg-emerald-50/30'
                    : isHovered
                    ? 'border-blue-300 bg-blue-50/30 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                  }
                  ${isLoading && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {/* Company Logo */}
                <div className="flex-shrink-0 h-12 w-12 rounded-xl overflow-hidden ring-1 ring-slate-200/50">
                  {hasLogo ? (
                    <img
                      src={company.companyLogo}
                      alt={company.companyName}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onError={() => handleImageError(company.companyId)}
                    />
                  ) : (
                    <div className={`h-full w-full bg-gradient-to-br ${getCompanyColor(company.companyName)} flex items-center justify-center font-bold text-base`}>
                      {getInitials(company.companyName) || <Building className="h-5 w-5" />}
                    </div>
                  )}
                </div>

                {/* Company Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 text-sm truncate">
                    {truncateName(company.companyName, 30)}
                  </h3>
                  <p className="text-xs text-slate-400 truncate">
                    {isLoadingCompany ? (
                      <span className="flex items-center gap-1.5 text-blue-600">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Connecting...
                      </span>
                    ) : isSelected ? (
                      <span className="flex items-center gap-1.5 text-emerald-600">
                        <Check className="h-3 w-3" />
                        Selected
                      </span>
                    ) : (
                      'Click to select'
                    )}
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="flex-shrink-0">
                  {isLoadingCompany ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    </div>
                  ) : isSelected ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                      <Check className="h-4 w-4 text-emerald-600" />
                    </div>
                  ) : isHovered ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      <ChevronRight className="h-4 w-4 text-blue-600" />
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>
                  )}
                </div>

                {/* Loading Overlay */}
                {isLoadingCompany && (
                  <div className="absolute inset-0 rounded-xl bg-blue-500/5 animate-pulse" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Empty State */}
        {companies.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
              <Building2 className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No companies found</h3>
            <p className="mt-2 text-sm text-slate-500">You don't have access to any companies</p>
          </motion.div>
        )}

        {/* Footer */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-200" />
          <p className="flex items-center gap-2 text-xs text-slate-400 whitespace-nowrap">
            <Shield className="h-3 w-3" />
            Secure access
          </p>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-200" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};