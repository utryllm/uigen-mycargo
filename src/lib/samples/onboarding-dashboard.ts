export const SAMPLE_ONBOARDING_DASHBOARD = `'use client';

import { useState } from 'react';
import { RefreshCw, Plus, ChevronDown, ChevronLeft, ChevronRight, Filter, MoreVertical } from 'lucide-react';

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

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'Submitted': return 'bg-[#F5F5F5]';
      case 'In Progress': return 'bg-[#E6F0FA]';
      case 'Completed': return 'bg-[#E8F5E9]';
      case 'Pending': return 'bg-[#FFF8E1]';
      default: return 'bg-[#F5F5F5]';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header Banner */}
      <div className="bg-[#C41230] h-2" />
      <div className="bg-[#FFD200] h-1" />

      {/* Main Content */}
      <div className="p-3 sm:p-6">
        {/* Title Row - Stack on mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
          <h1 className="text-xl sm:text-2xl font-semibold text-[#333333]">Onboarding Dashboard</h1>
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 border border-[#E0E0E0] rounded bg-white text-[#333333] hover:bg-[#F5F5F5] transition-colors text-xs sm:text-sm">
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button className="text-[#0066CC] hover:underline font-medium text-xs sm:text-sm hidden sm:block">
              Manage my team
            </button>
            <button className="flex items-center gap-1 sm:gap-2 text-[#C41230] font-medium hover:underline text-xs sm:text-sm">
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Add new request</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* Tabs - Scrollable on mobile */}
        <div className="flex gap-0 mb-4 sm:mb-6 overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
          {(['request', 'case', 'task'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={\`px-3 sm:px-6 py-2 sm:py-3 font-medium capitalize border border-[#E0E0E0] transition-colors text-xs sm:text-sm whitespace-nowrap \${
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
        <div className="bg-white border border-[#E0E0E0] rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
          <p className="text-xs sm:text-sm text-[#666666] mb-2 sm:mb-3">
            View active requests. Select Filter to view specific requests.
          </p>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {(['my', 'all', 'team'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={\`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors \${
                  activeFilter === filter
                    ? 'bg-[#333333] text-white'
                    : 'bg-white border border-[#E0E0E0] text-[#666666] hover:bg-[#F5F5F5]'
                }\`}
              >
                {filter === 'my' ? 'My requests' : filter === 'all' ? 'All requests' : "Team's"}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Applied & Pagination */}
        <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
          <button className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#333333] text-white rounded-full text-xs sm:text-sm">
            <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
            Filters
          </button>
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-xs sm:text-sm text-[#666666]">1-10 of {totalItems}</span>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="p-1 rounded border border-[#E0E0E0] hover:bg-[#F5F5F5]"
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-[#666666]" />
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="p-1 rounded border border-[#E0E0E0] hover:bg-[#F5F5F5]"
            >
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-[#666666]" />
            </button>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden space-y-3">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-white border border-[#E0E0E0] rounded-lg p-3"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-[#333333] truncate">{request.name}</h3>
                  <p className="text-xs text-[#666666]">{request.requestId}</p>
                </div>
                <button className="p-1 text-[#666666]">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className={\`px-2 py-0.5 rounded-full text-xs font-medium \${getStatusColor(request.status)} \${getStatusBgColor(request.status)}\`}>
                  {request.status}
                </span>
                <span className="text-xs text-[#666666]">{request.creationDate}</span>
              </div>
              <p className="text-xs text-[#666666] truncate mb-2">{request.parentLineOfBusiness}</p>
              <button className="text-[#0066CC] text-xs font-medium hover:underline">
                Continue
              </button>
            </div>
          ))}
        </div>

        {/* Desktop Data Table */}
        <div className="hidden sm:block bg-white border border-[#E0E0E0] rounded-lg overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[800px]">
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
                    Date
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-[#666666] cursor-pointer hover:text-[#333333]"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    Status
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-[#666666] cursor-pointer hover:text-[#333333]"
                  onClick={() => handleSort('parentLineOfBusiness')}
                >
                  <div className="flex items-center gap-1">
                    Parent LOB
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
                  <td className="px-4 py-3 text-sm text-[#333333] max-w-[200px] truncate">{request.parentLineOfBusiness}</td>
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
        <div className="flex items-center justify-end mt-3 sm:mt-4 gap-2">
          <span className="text-xs sm:text-sm text-[#666666]">Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}</span>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-2 sm:px-3 py-1 border border-[#E0E0E0] rounded text-xs sm:text-sm text-[#666666] hover:bg-[#F5F5F5] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
            className="px-2 sm:px-3 py-1 border border-[#E0E0E0] rounded text-xs sm:text-sm text-[#666666] hover:bg-[#F5F5F5] disabled:opacity-50 disabled:cursor-not-allowed"
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
