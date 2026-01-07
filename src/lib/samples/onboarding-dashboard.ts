export const SAMPLE_ONBOARDING_DASHBOARD = `'use client';

import { useState } from 'react';
import { RefreshCw, Plus, ChevronDown, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';

interface Request {
  id: string;
  name: string;
  requestId: string;
  creationDate: string;
  status: 'Submitted' | 'In Progress' | 'Completed' | 'Pending';
  parentLineOfBusiness: string;
  lineOfBusiness: string;
}

export default function OnboardingDashboard() {
  const [activeTab, setActiveTab] = useState<'request' | 'case' | 'task'>('request');
  const [activeFilter, setActiveFilter] = useState<'my' | 'all' | 'team'>('my');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [sortColumn, setSortColumn] = useState<string>('creationDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const requests: Request[] = [
    { id: '1', name: '10dec_gsmos_testing', requestId: 'REQ20732', creationDate: '12/10/2025', status: 'Submitted', parentLineOfBusiness: 'Corporate Investment Bank (CIB)', lineOfBusiness: 'Commercial Real Estate' },
    { id: '2', name: '8Dec_GSMOS', requestId: 'REQ20397', creationDate: '12/08/2025', status: 'Submitted', parentLineOfBusiness: 'Corporate Investment Bank (CIB)', lineOfBusiness: 'Commercial Real Estate' },
    { id: '3', name: '2dedc_gsmos_testing2', requestId: 'REQ20092', creationDate: '12/02/2025', status: 'Submitted', parentLineOfBusiness: 'Corporate Investment Bank (CIB)', lineOfBusiness: 'Commercial Real Estate' },
    { id: '4', name: '2dec_gsmos_testing', requestId: 'REQ20081', creationDate: '12/02/2025', status: 'Submitted', parentLineOfBusiness: 'Corporate Investment Bank (CIB)', lineOfBusiness: 'Commercial Real Estate' },
    { id: '5', name: '1Dec_GSMOS_screening_test', requestId: 'REQ20021', creationDate: '12/01/2025', status: 'Submitted', parentLineOfBusiness: 'Commercial Banking (CB)', lineOfBusiness: 'Business Banking Group' },
    { id: '6', name: '28_Nov_screeningresults', requestId: 'REQ19954', creationDate: '11/28/2025', status: 'Submitted', parentLineOfBusiness: 'Corporate Investment Bank (CIB)', lineOfBusiness: 'Commercial Real Estate' },
    { id: '7', name: 'Nov_test_request', requestId: 'REQ19850', creationDate: '11/25/2025', status: 'In Progress', parentLineOfBusiness: 'Corporate Investment Bank (CIB)', lineOfBusiness: 'Markets' },
    { id: '8', name: 'Q4_onboarding_batch', requestId: 'REQ19742', creationDate: '11/20/2025', status: 'Completed', parentLineOfBusiness: 'Wealth Management', lineOfBusiness: 'Private Banking' },
    { id: '9', name: 'Client_verification_nov', requestId: 'REQ19680', creationDate: '11/18/2025', status: 'Pending', parentLineOfBusiness: 'Corporate Investment Bank (CIB)', lineOfBusiness: 'Commercial Real Estate' },
    { id: '10', name: 'KYC_update_request', requestId: 'REQ19550', creationDate: '11/15/2025', status: 'Submitted', parentLineOfBusiness: 'Commercial Banking (CB)', lineOfBusiness: 'Middle Market Banking' },
  ];

  const totalItems = 23;
  const itemsPerPage = 10;

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted': return 'text-[#333333]';
      case 'In Progress': return 'text-[#0066CC]';
      case 'Completed': return 'text-[#28A745]';
      case 'Pending': return 'text-[#FFC107]';
      default: return 'text-[#333333]';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header Banner */}
      <div className="bg-[#C41230] h-2" />
      <div className="bg-[#FFD200] h-1" />

      {/* Main Content */}
      <div className="p-6">
        {/* Title Row */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#333333]">Onboarding Dashboard</h1>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border border-[#E0E0E0] rounded bg-white text-[#333333] hover:bg-[#F5F5F5] transition-colors">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button className="text-[#0066CC] hover:underline font-medium">
              Manage my team
            </button>
            <button className="flex items-center gap-2 text-[#C41230] font-medium hover:underline">
              <Plus className="w-4 h-4" />
              Add new request
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-6">
          {(['request', 'case', 'task'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={\`px-6 py-3 font-medium capitalize border border-[#E0E0E0] transition-colors \${
                activeTab === tab
                  ? 'bg-white text-[#333333] border-b-white -mb-px z-10'
                  : 'bg-[#F5F5F5] text-[#666666] hover:bg-[#FAFAFA]'
              }\`}
            >
              {tab} view
            </button>
          ))}
        </div>

        {/* Filter Section */}
        <div className="bg-white border border-[#E0E0E0] rounded-lg p-4 mb-4">
          <p className="text-sm text-[#666666] mb-3">
            View active requests. Select Filter to view specific requests.
          </p>
          <div className="flex items-center gap-3">
            {(['my', 'all', 'team'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={\`px-4 py-2 rounded-full text-sm font-medium transition-colors \${
                  activeFilter === filter
                    ? 'bg-[#333333] text-white'
                    : 'bg-white border border-[#E0E0E0] text-[#666666] hover:bg-[#F5F5F5]'
                }\`}
              >
                {filter === 'my' ? 'My requests' : filter === 'all' ? 'All requests' : "My team's requests"}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Applied */}
        <div className="flex items-center justify-between mb-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#333333] text-white rounded-full text-sm">
            <Filter className="w-4 h-4" />
            Filters applied
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#666666]">1 to 10 of {totalItems}</span>
            <ChevronDown className="w-4 h-4 text-[#666666]" />
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="p-1 rounded border border-[#E0E0E0] hover:bg-[#F5F5F5]"
            >
              <ChevronLeft className="w-4 h-4 text-[#666666]" />
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="p-1 rounded border border-[#E0E0E0] hover:bg-[#F5F5F5]"
            >
              <ChevronRight className="w-4 h-4 text-[#666666]" />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-[#E0E0E0] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F5F5F5] border-b border-[#E0E0E0]">
              <tr>
                <th className="w-8 px-2 py-3"></th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-[#666666] cursor-pointer hover:text-[#333333]"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Request Name
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-[#666666] cursor-pointer hover:text-[#333333]"
                  onClick={() => handleSort('requestId')}
                >
                  <div className="flex items-center gap-1">
                    Request ID
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-[#666666] cursor-pointer hover:text-[#333333]"
                  onClick={() => handleSort('creationDate')}
                >
                  <div className="flex items-center gap-1">
                    Request Creation Date
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-[#666666] cursor-pointer hover:text-[#333333]"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    Request Status
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-[#666666] cursor-pointer hover:text-[#333333]"
                  onClick={() => handleSort('parentLineOfBusiness')}
                >
                  <div className="flex items-center gap-1">
                    Parent Line of Business
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-[#666666] cursor-pointer hover:text-[#333333]"
                  onClick={() => handleSort('lineOfBusiness')}
                >
                  <div className="flex items-center gap-1">
                    Line of Business
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#666666]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E0E0]">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-2 py-3">
                    <button
                      onClick={() => toggleRow(request.id)}
                      className="p-1 rounded hover:bg-[#F5F5F5]"
                    >
                      <ChevronDown
                        className={\`w-4 h-4 text-[#666666] transition-transform \${
                          expandedRows.has(request.id) ? 'rotate-180' : ''
                        }\`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#333333]">{request.name}</td>
                  <td className="px-4 py-3 text-sm text-[#333333]">{request.requestId}</td>
                  <td className="px-4 py-3 text-sm text-[#333333]">{request.creationDate}</td>
                  <td className={\`px-4 py-3 text-sm \${getStatusColor(request.status)}\`}>
                    {request.status}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#333333]">{request.parentLineOfBusiness}</td>
                  <td className="px-4 py-3 text-sm text-[#333333]">{request.lineOfBusiness}</td>
                  <td className="px-4 py-3">
                    <button className="text-[#0066CC] text-sm font-medium hover:underline">
                      Continue
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="flex items-center justify-end mt-4 gap-2">
          <span className="text-sm text-[#666666]">Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}</span>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-[#E0E0E0] rounded text-sm text-[#666666] hover:bg-[#F5F5F5] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
            className="px-3 py-1 border border-[#E0E0E0] rounded text-sm text-[#666666] hover:bg-[#F5F5F5] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}`;

export const SAMPLE_SCREEN_NAME = 'OnboardingDashboard';
export const SAMPLE_SCREEN_DESCRIPTION = 'Enterprise onboarding dashboard with request management, filters, and data table';
