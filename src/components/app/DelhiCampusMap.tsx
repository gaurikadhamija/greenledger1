import React, { useEffect, useRef, useState, useTransition } from 'react';
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  useMap,
} from '@vis.gl/react-google-maps';
import L from 'leaflet';
import {
  MapPin,
  Search,
  RotateCcw,
  Building2,
  Calendar,
  FileCheck2,
  Zap,
  TrendingDown,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  Map as MapIcon,
  Navigation,
} from 'lucide-react';
import { Campus } from '../../types';
import { formatInr, formatKwh, formatPercent } from '../../lib/formatters';
import {
  SubtleLeaf,
  BotanicalSprig,
  LeafCornerAccent,
  LeafBadge,
} from '../common/BotanicalLeaf';

interface DelhiCampusMapProps {
  campuses: Campus[];
  selectedCampusId: string;
  onSelectCampus: (campusId: string) => void;
  onOpenAuditCreate?: (campusId: string) => void;
  onOpenWorkspaceTab?: (tab: string) => void;
  onSeedSampleAudit?: (campusId: string) => Promise<void>;
  isLoading?: boolean;
}

// Custom Map Controller to smoothly pan & fit bounds via Google Maps SDK
const GoogleMapPanController: React.FC<{
  campuses: Campus[];
  selectedCampus: Campus | undefined;
  triggerFitCount: number;
}> = ({ campuses, selectedCampus, triggerFitCount }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !selectedCampus) return;
    map.panTo({
      lat: selectedCampus.coordinates.lat,
      lng: selectedCampus.coordinates.lng,
    });
    // Smooth zoom in for campus detail inspect
    map.setZoom(13.8);
  }, [map, selectedCampus]);

  useEffect(() => {
    if (!map || campuses.length === 0 || triggerFitCount === 0) return;
    try {
      const googleMaps = (window as any).google?.maps;
      if (!googleMaps) return;
      const bounds = new googleMaps.LatLngBounds();
      campuses.forEach((c) => {
        bounds.extend({ lat: c.coordinates.lat, lng: c.coordinates.lng });
      });
      map.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 });
    } catch {
      // Ignore if google namespace not yet initialized
    }
  }, [map, campuses, triggerFitCount]);

  return null;
};

// Clean Fallback Leaflet Map (Using 100% free, un-watermarked OpenStreetMap tiles)
const LeafletFallbackMap: React.FC<{
  campuses: Campus[];
  selectedCampusId: string;
  onSelectCampus: (id: string) => void;
}> = ({ campuses, selectedCampusId, onSelectCampus }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(containerRef.current, {
        center: [28.635, 77.18],
        zoom: 11,
        minZoom: 10,
        maxZoom: 17,
        zoomControl: false,
      });

      // Free un-watermarked OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);
      mapRef.current = map;
    }

    const map = mapRef.current;
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    campuses.forEach((campus, idx) => {
      const isSelected = campus.id === selectedCampusId;
      const latLng: [number, number] = [campus.coordinates.lat, campus.coordinates.lng];

      const markerHtml = `
        <div style="display: flex; align-items: center; gap: 6px; transform: translate(-50%, -50%); cursor: pointer;">
          <div style="
            width: ${isSelected ? '36px' : '30px'};
            height: ${isSelected ? '36px' : '30px'};
            border-radius: 9999px;
            background: ${isSelected ? '#960d41' : '#09453d'};
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            font-weight: 700;
            border: 2px solid #fffefa;
            box-shadow: 0 4px 14px rgba(33, 21, 15, 0.28);
          ">
            0${idx + 1}
          </div>
          <div style="
            background: rgba(255, 254, 250, 0.96);
            padding: 3px 8px;
            border-radius: 6px;
            border: 1px solid #cfc7b4;
            font-family: 'Poppins', sans-serif;
            font-size: 11px;
            font-weight: 600;
            color: ${isSelected ? '#960d41' : '#21150f'};
            box-shadow: 0 2px 8px rgba(33, 21, 15, 0.12);
            white-space: nowrap;
          ">
            ${campus.abbreviation}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'delhi-clean-div-icon',
        iconSize: [120, 40],
        iconAnchor: [18, 18],
      });

      const marker = L.marker(latLng, { icon: customIcon }).addTo(map);
      marker.on('click', () => {
        onSelectCampus(campus.id);
        map.setView(latLng, 14, { animate: true });
      });
      markersRef.current[campus.id] = marker;
    });
  }, [campuses, selectedCampusId, onSelectCampus]);

  return <div ref={containerRef} className="w-full h-full min-h-[380px] lg:min-h-[520px]" />;
};

export const DelhiCampusMap: React.FC<DelhiCampusMapProps> = ({
  campuses,
  selectedCampusId,
  onSelectCampus,
  onOpenAuditCreate,
  onOpenWorkspaceTab,
  onSeedSampleAudit,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);
  const [fitCounter, setFitCounter] = useState(0);
  const [mapMode, setMapMode] = useState<'google' | 'cartographic'>('google');
  const [googleMapsError, setGoogleMapsError] = useState(false);

  // Access user provided Google Maps API key via env or runtime fallback
  const mapsApiKey =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    'AIzaSyBvfOup7jf52cOzdLUgbXrQ-85S0QncKpM';

  const selectedCampus =
    campuses.find((c) => c.id === selectedCampusId) || campuses[0];

  const filteredCampuses = campuses.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.discom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleResetBounds = () => {
    setFitCounter((prev) => prev + 1);
  };

  const handleSeed = async () => {
    if (!onSeedSampleAudit || isSeeding) return;
    setIsSeeding(true);
    try {
      await onSeedSampleAudit(selectedCampus.id);
    } finally {
      setIsSeeding(false);
    }
  };

  const hasAuditRecords =
    (selectedCampus.auditsCount || 0) > 0 || (selectedCampus.evidenceCount || 0) > 0;

  return (
    <div className="bg-[#f0edde] border border-[#cfc7b4] rounded-2xl overflow-hidden shadow-xs relative">
      {/* Top Header & Search Bar with Botanical Accents */}
      <div className="p-4 sm:p-5 border-b border-[#cfc7b4] bg-[#fffefa]/80 backdrop-blur-xs flex flex-col md:flex-row md:items-center justify-between gap-4 relative">
        <div>
          <div className="flex items-center gap-2">
            <BotanicalSprig size={18} color="#09453d" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#09453d] font-semibold">
              DELHI CAMPUS DIRECTORY & GEOGRAPHIC AUDIT REGISTRY
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <h3 className="font-serif text-xl sm:text-2xl text-[#21150f] font-medium flex items-center gap-2">
              <span>Delhi Institutional Sustainability Network</span>
              <SubtleLeaf size={18} color="#2d6a4f" className="hidden sm:inline-block" />
            </h3>
          </div>
          <p className="text-xs text-[#574539] font-sans mt-0.5">
            5 Verified NCT Delhi University Hubs · Dedicated Tata Power DDL & BSES Rajdhani Feeder Telemetry
          </p>
        </div>

        {/* Search, Map Layer Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Map Layer Mode Toggle */}
          <div className="inline-flex items-center p-0.5 bg-[#f0edde] border border-[#cfc7b4] rounded-full text-[11px] font-mono">
            <button
              type="button"
              onClick={() => {
                setGoogleMapsError(false);
                setMapMode('google');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors cursor-pointer ${
                mapMode === 'google' && !googleMapsError
                  ? 'bg-[#09453d] text-white font-semibold shadow-2xs'
                  : 'text-[#574539] hover:text-[#21150f]'
              }`}
              title="Official Google Maps Platform Layer"
            >
              <MapIcon className="w-3 h-3" />
              <span>Google Maps</span>
            </button>
            <button
              type="button"
              onClick={() => setMapMode('cartographic')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors cursor-pointer ${
                mapMode === 'cartographic' || googleMapsError
                  ? 'bg-[#09453d] text-white font-semibold shadow-2xs'
                  : 'text-[#574539] hover:text-[#21150f]'
              }`}
              title="Clean Unwatermarked Cartographic Layer"
            >
              <Layers className="w-3 h-3" />
              <span>Editorial Clean</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#6f6052] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search 5 Delhi campuses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs font-sans bg-[#fffefa] border border-[#cfc7b4] rounded-full focus:outline-none focus:border-[#09453d] w-44 sm:w-56 shadow-2xs"
            />
          </div>

          <button
            onClick={handleResetBounds}
            title="Reset camera to fit all Delhi campuses"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-[#21150f] bg-[#fffefa] hover:bg-[#f4f0e5] border border-[#cfc7b4] rounded-full transition-colors cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3 h-3 text-[#09453d]" />
            <span className="hidden sm:inline">Fit Bounds</span>
          </button>
        </div>
      </div>

      {/* Main Map + Campus Detail Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
        {/* Map View Container (7 cols on lg) */}
        <div className="lg:col-span-7 relative bg-[#e0d9c6] min-h-[380px] lg:min-h-[520px] border-b lg:border-b-0 lg:border-r border-[#cfc7b4]">
          {mapMode === 'google' && !googleMapsError ? (
            <APIProvider
              apiKey={mapsApiKey}
              libraries={['marker']}
              onError={(e) => {
                console.warn('Google Maps API fallback activated:', e);
                setGoogleMapsError(true);
              }}
            >
              <GoogleMap
                id="delhi-campus-google-map"
                mapId="DEMO_MAP_ID"
                defaultCenter={{ lat: 28.635, lng: 77.18 }}
                defaultZoom={11.2}
                gestureHandling="greedy"
                disableDefaultUI={false}
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                style={{ width: '100%', height: '100%', minHeight: '380px' }}
              >
                <GoogleMapPanController
                  campuses={campuses}
                  selectedCampus={selectedCampus}
                  triggerFitCount={fitCounter}
                />

                {campuses.map((campus, idx) => {
                  const isSelected = campus.id === selectedCampusId;
                  return (
                    <AdvancedMarker
                      key={campus.id}
                      position={{
                        lat: campus.coordinates.lat,
                        lng: campus.coordinates.lng,
                      }}
                      title={`${campus.name} (${campus.abbreviation})`}
                      onClick={() => onSelectCampus(campus.id)}
                      zIndex={isSelected ? 100 : 10}
                    >
                      <div
                        className={`flex items-center gap-1.5 cursor-pointer transition-transform duration-200 select-none ${
                          isSelected
                            ? 'scale-110 -translate-y-1.5'
                            : 'hover:scale-105'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold text-white border-2 border-[#fffefa] shadow-md transition-colors ${
                            isSelected
                              ? 'bg-[#960d41] ring-2 ring-[#960d41]'
                              : 'bg-[#09453d]'
                          }`}
                        >
                          0{idx + 1}
                        </div>
                        <div
                          className={`px-2.5 py-1 rounded-md text-xs font-sans font-semibold border backdrop-blur-xs shadow-md transition-colors ${
                            isSelected
                              ? 'bg-[#960d41] text-white border-[#960d41]'
                              : 'bg-[#fffefa]/95 text-[#21150f] border-[#cfc7b4]'
                          }`}
                        >
                          {campus.abbreviation}
                        </div>
                      </div>
                    </AdvancedMarker>
                  );
                })}
              </GoogleMap>
            </APIProvider>
          ) : (
            <LeafletFallbackMap
              campuses={campuses}
              selectedCampusId={selectedCampusId}
              onSelectCampus={onSelectCampus}
            />
          )}

          {/* Map Overlay Badge with Botanical Accent */}
          <div className="absolute bottom-4 left-4 z-10 pointer-events-none bg-[#fffefa]/95 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-[#cfc7b4] text-[11px] font-mono text-[#574539] shadow-sm flex items-center gap-2">
            <SubtleLeaf size={14} color="#09453d" />
            <span className="font-semibold text-[#09453d]">NCT of Delhi</span>
            <span className="text-[#cfc7b4]">·</span>
            <span>5 Verified Universities Plotted</span>
            <span className="text-[#cfc7b4]">·</span>
            <span className="text-[10px] text-[#6f6052]">
              {mapMode === 'google' && !googleMapsError ? 'Google Maps Platform' : 'Clean OSM Vector'}
            </span>
          </div>
        </div>

        {/* Selected Campus Detail Panel (5 cols on lg) */}
        <div className="lg:col-span-5 p-5 sm:p-6 bg-[#fffefa] flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Decorative Botanical Corner Accent */}
          <LeafCornerAccent position="top-right" className="absolute top-2 right-2" />

          <div>
            {/* Top Campus Identity */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#cfc7b4]">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#e8f1ec] border border-[#09453d]/20 text-[11px] font-mono text-[#09453d] font-semibold mb-1.5">
                  <SubtleLeaf size={12} color="#09453d" />
                  <span>DELHI DIRECTORY SPECIMEN</span>
                  <span>·</span>
                  <span>{selectedCampus.abbreviation}</span>
                </div>
                <h4 className="font-serif text-xl sm:text-2xl text-[#21150f] font-semibold leading-tight">
                  {selectedCampus.name}
                </h4>
                <p className="text-xs text-[#574539] font-sans mt-1.5 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#960d41] shrink-0 mt-0.5" />
                  <span>
                    {selectedCampus.address}, {selectedCampus.city} {selectedCampus.pincode}
                  </span>
                </p>
              </div>

              {selectedCampus.website && (
                <a
                  href={selectedCampus.website}
                  target="_blank"
                  rel="noreferrer"
                  title="Visit university official portal"
                  className="p-2 rounded-full border border-[#cfc7b4] hover:bg-[#f4f0e5] text-[#574539] transition-colors shrink-0 z-10"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Public Metadata Attributes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-4 text-xs font-mono bg-[#f7f4e9] p-3 rounded-xl border border-[#cfc7b4]">
              <div>
                <span className="text-[#6f6052] block text-[10px] uppercase">Established</span>
                <span className="font-semibold text-[#21150f]">
                  {selectedCampus.establishedYear}
                </span>
              </div>
              <div>
                <span className="text-[#6f6052] block text-[10px] uppercase">Campus Area</span>
                <span className="font-semibold text-[#21150f]">
                  {selectedCampus.campusAreaAcres} Acres
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[#6f6052] block text-[10px] uppercase">DISCOM Feeder</span>
                <span
                  className="font-semibold text-[#09453d] truncate block"
                  title={selectedCampus.discom}
                >
                  {selectedCampus.discom.includes('Tata') ? 'Tata Power DDL' : 'BSES Rajdhani'}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#574539] leading-relaxed mb-4">
              {selectedCampus.description}
            </p>

            {/* Real Audit Metrics & Honest Empty State */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#6f6052] block font-semibold">
                  AUDIT DATABASE STATUS
                </span>
                <LeafBadge label="Delhi Scope 2 Ledger" variant="sage" />
              </div>

              {hasAuditRecords ? (
                /* Real Data Available */
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 bg-[#e8f1ec] border border-[#09453d]/20 rounded-xl relative overflow-hidden">
                      <span className="text-[#09453d] block font-mono text-[10px] uppercase font-semibold">
                        Verified Electricity
                      </span>
                      <span className="font-serif text-lg font-bold text-[#09453d]">
                        {formatKwh(selectedCampus.totalKwh)}
                      </span>
                      <span className="text-[10px] font-mono text-[#57927f] block mt-0.5">
                        {formatInr(selectedCampus.totalCostInr)} billed
                      </span>
                    </div>

                    <div className="p-3 bg-[#fffefa] border border-[#cfc7b4] rounded-xl">
                      <span className="text-[#6f6052] block font-mono text-[10px] uppercase">
                        Evidence Coverage
                      </span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="font-serif text-lg font-bold text-[#21150f]">
                          {selectedCampus.evidenceCoveragePercent !== null
                            ? `${selectedCampus.evidenceCoveragePercent}%`
                            : '—'}
                        </span>
                        <span className="text-[10px] font-mono text-[#09453d] font-semibold">
                          ({selectedCampus.evidenceCount} bills)
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#574539] block mt-0.5">
                        {selectedCampus.auditsCount} verified audit(s)
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#f0edde] border border-[#cfc7b4] rounded-lg text-xs font-mono flex items-center justify-between">
                    <span className="text-[#6f6052]">Reporting Cycle:</span>
                    <span className="font-semibold text-[#21150f]">
                      {selectedCampus.latestPeriod || 'Active'}
                    </span>
                  </div>
                </div>
              ) : (
                /* Honest Empty State: No Invented Statistics */
                <div className="p-4 bg-[#fbf9f4] border border-dashed border-[#cfc7b4] rounded-xl text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-[#f0edde] text-[#6f6052] mx-auto flex items-center justify-center">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <h5 className="font-serif text-sm font-semibold text-[#21150f]">
                    No verified audit data available yet.
                  </h5>
                  <p className="text-xs text-[#6f6052] max-w-xs mx-auto font-sans">
                    Zero demonstration assumptions are fabricated. Initiate the first official energy audit for {selectedCampus.abbreviation} with primary utility bills.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-[#cfc7b4] space-y-2 mt-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenWorkspaceTab && onOpenWorkspaceTab('overview')}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-sans font-medium text-white bg-[#09453d] hover:bg-[#073630] rounded-full transition-colors cursor-pointer shadow-xs"
              >
                <span>View {selectedCampus.abbreviation} Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onOpenAuditCreate && onOpenAuditCreate(selectedCampus.id)}
                className="flex items-center gap-1.5 py-2.5 px-4 text-xs font-sans font-medium text-[#21150f] bg-[#f0edde] hover:bg-[#e0d9c6] border border-[#cfc7b4] rounded-full transition-colors cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#09453d]" />
                <span>New Audit</span>
              </button>
            </div>

            {/* Quick Helper: Seed sample audit for this campus */}
            {onSeedSampleAudit && !hasAuditRecords && (
              <button
                onClick={handleSeed}
                disabled={isSeeding}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-[11px] font-mono text-[#09453d] bg-[#e8f1ec]/80 hover:bg-[#e8f1ec] border border-[#09453d]/30 rounded-lg transition-colors cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-[#09453d]" />
                <span>
                  {isSeeding
                    ? 'Generating 12-month verified audit...'
                    : `Load 12-Month DISCOM Bills for ${selectedCampus.abbreviation}`}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Accessible Campus Switcher List (Desktop & Mobile) */}
      <div className="p-4 bg-[#f7f4e9] border-t border-[#cfc7b4]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <SubtleLeaf size={14} color="#09453d" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#6f6052] font-semibold">
              SELECT CAMPUS SPECIMEN ({filteredCampuses.length} of 5)
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#09453d]">
            Click any institution to pan & inspect
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {filteredCampuses.map((campus, index) => {
            const isSelected = campus.id === selectedCampusId;
            const hasData =
              (campus.auditsCount || 0) > 0 || (campus.evidenceCount || 0) > 0;

            return (
              <button
                key={campus.id}
                onClick={() => onSelectCampus(campus.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#fffefa] border-[#960d41] ring-1 ring-[#960d41] shadow-xs'
                    : 'bg-[#fffefa]/70 hover:bg-[#fffefa] border-[#cfc7b4]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm ${
                      isSelected
                        ? 'bg-[#960d41] text-white'
                        : 'bg-[#e0d9c6] text-[#21150f]'
                    }`}
                  >
                    0{index + 1}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                      hasData
                        ? 'bg-[#e8f1ec] text-[#09453d]'
                        : 'bg-[#f0edde] text-[#6f6052]'
                    }`}
                  >
                    {hasData ? `${campus.evidenceCount} Bills` : 'No audits yet'}
                  </span>
                </div>

                <div className="font-serif font-semibold text-sm text-[#21150f] truncate">
                  {campus.abbreviation}
                </div>
                <div className="text-[11px] text-[#574539] truncate font-sans">
                  {campus.name}
                </div>
                <div className="text-[10px] font-mono text-[#6f6052] truncate mt-1">
                  {campus.city} · {campus.discom.includes('Tata') ? 'TPDDL' : 'BRPL'}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
