import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import {
  Save,
  RefreshCw,
  Trash2,
  Upload,
  Plus,
  Minus,
  X,
  Eye,
  Image as ImageIcon,
  Link,
  BookOpen,
  Target,
  Award,
  Users,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
  Home,
  Heart,
  TrendingUp,
  MessageSquare,
  FileText,
  Globe,
  Phone,
  Mail,
  MapPin,
  Facebook,
  
  Book,
  Coffee,
  Leaf,
  Scissors,
  Lightbulb,
  ShoppingBag,
  
  BarChart3,
  Copy,
  Download,
  UploadCloud,
  
  Mail as MailIcon,
 
  Users as UsersIcon,
  UserCheck,
  Award as AwardIcon,
  Trophy,
  Flag,
  Filter,
  Search,
  Grid,
  List,
  Layout,
  Sidebar,
  Menu,
  MoreVertical,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Move,
  GripVertical,
  Trash,
  Archive,
  Inbox,
  Folder,
  FolderOpen,
  File,
  FileText as FileTextIcon,
  FilePlus,
  FolderPlus,
  DownloadCloud,
  Upload as UploadIcon,
  Share2,
  ExternalLink,
  Link2,
  AtSign,
  Hash,
  DollarSign,
  CreditCard,
  ShoppingCart,
  Package,
  Truck,
  Box,
  Layers,
  Grid as GridIcon,
  Columns,
  Sidebar as SidebarIcon,
  Package as PackageIcon,
  Droplet,
  CloudRain,
  Sun,
  Moon,
  Cloud as CloudIcon,
  Wind,
  Thermometer,
  Umbrella,
  Anchor,
  Compass,
  Map,
  Navigation,
  Flag as FlagIcon,
  Globe as GlobeIcon,
  MapPin as MapPinIcon,
  Navigation2,
  Crosshair,
  Target as TargetIcon,
  Watch,
  Clock as ClockIcon,
  Calendar,
  Watch as WatchIcon,
  Bell as BellIcon,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  Check,
  XCircle,
  X as XIcon,
  MinusCircle,
  PlusCircle,
  Radio,
  ToggleLeft,
  ToggleRight,
  CheckSquare,
  Square,
  Circle,
  Play,
  StopCircle,
  Pause,
  SkipBack,
  SkipForward,
  FastForward,
  Rewind,
  PlayCircle,
  PauseCircle,
  Music as MusicIcon,
  Volume2,
  VolumeX,
  Volume1,
  Volume,
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Camera as CameraIcon,
  CameraOff,
  Image as ImageIcon2,
  Film,
  Tv,
  Radio as RadioIcon,
  Speaker,
  Headphones as HeadphonesIcon,
  Mic as MicIcon,
  Video as VideoIcon2,
  Phone as PhoneIcon,
  PhoneOff,
  PhoneCall,
  PhoneForwarded,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Voicemail,
  MessageCircle,
  MessageSquare as MessageSquareIcon,
  Send,
  Mail as MailIcon2,
  Inbox as InboxIcon,
  Archive as ArchiveIcon,
  Bell as BellIcon2,
  BellOff,
  Rss,
  Heart as HeartIcon,
  ThumbsUp,
  ThumbsDown,
  Star as StarIcon,
  Flag as FlagIcon2,
  Bookmark,
  BookOpen as BookOpenIcon,
  Book as BookIcon,
  Bookmark as BookmarkIcon,
  Clipboard,
  FileCheck,
  FileMinus,
  FilePlus as FilePlusIcon,
  FileX,
  Folder as FolderIcon,
  FolderMinus,
  FolderPlus as FolderPlusIcon,
  FolderX,
  HardDrive,
  Save as SaveIcon,
  Upload as UploadIcon2,
  Download as DownloadIcon,
  Cloud as CloudIcon2,
  CloudDrizzle,
  CloudLightning,
  CloudOff,
  CloudSnow,
  CloudSun,
  Droplets,
  ThermometerSun,
  Umbrella as UmbrellaIcon,
  Wind as WindIcon,
  Compass as CompassIcon,
  Navigation as NavigationIcon,
  Map as MapIcon,
  Globe as GlobeIcon2,
  MapPin as MapPinIcon2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE_URL = 'https://shekhai-server.onrender.com/api/v1/homepage';

// Function to convert blob to base64 for permanent storage
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Function to check if string is a base64 image
const isBase64Image = (str) => {
  return str && str.startsWith('data:image/');
};

// Memoized InputField component
const InputField = memo(({ 
  label, 
  value, 
  onChange, 
  type = 'text', 
  placeholder = '', 
  required = false,
  icon: Icon,
  className = '',
  rows = 4,
  min,
  max,
  step
}) => (
  <div className="mb-3">
    <label className="form-label d-flex align-items-center gap-2">
      {Icon && <Icon className="h-4 w-4 text-secondary" />}
      {label}
      {required && <span className="text-danger ms-1">*</span>}
    </label>
    {type === 'textarea' ? (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={`form-control ${className}`}
      />
    ) : type === 'select' ? (
      <select
        value={value}
        onChange={onChange}
        className={`form-select ${className}`}
        required={required}
      >
        {placeholder && <option value="">{placeholder}</option>}
        <option value="Facebook">Facebook</option>
        <option value="Twitter">Twitter</option>
        <option value="Instagram">Instagram</option>
        <option value="LinkedIn">LinkedIn</option>
        <option value="YouTube">YouTube</option>
        <option value="TikTok">TikTok</option>
        <option value="GitHub">GitHub</option>
        <option value="Discord">Discord</option>
      </select>
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`form-control ${className}`}
        min={min}
        max={max}
        step={step}
      />
    )}
  </div>
));

InputField.displayName = 'InputField';

// Enhanced ImageUploadField component
const ImageUploadField = memo(({ 
  label, 
  value, 
  onTextChange,
  onFileUpload,
  field,
  placeholder = 'Enter image URL or upload',
  isLoading,
  onRemove,
  accept = 'image/*',
  helpText = 'Supported: JPG, PNG, GIF, WebP, SVG • Max: 5MB',
  previewSize = { width: '200px', height: '150px' }
}) => {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(value);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setPreviewUrl(value);
  }, [value]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    await processAndUploadFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      await processAndUploadFile(file);
    }
  };

  const processAndUploadFile = async (file) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);

    try {
      const base64Image = await fileToBase64(file);
      onFileUpload(field, base64Image);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    if (onRemove) {
      onRemove(field);
    }
    setPreviewUrl('');
  };

  const handleCopyBase64 = () => {
    if (value && value.startsWith('data:image/')) {
      navigator.clipboard.writeText(value)
        .then(() => toast.success('Base64 copied to clipboard'))
        .catch(() => toast.error('Failed to copy'));
    }
  };

  return (
    <div className="mb-4">
      <label className="form-label d-flex align-items-center gap-2">
        <ImageIcon className="h-4 w-4 text-secondary" />
        {label}
      </label>
      
      <div className="d-flex flex-column gap-3">
        {previewUrl && (
          <div className="flex-shrink-0">
            <div className="position-relative" style={previewSize}>
              <img 
                src={previewUrl} 
                alt={label}
                className="w-100 h-100 object-fit-cover rounded border"
                style={{ objectFit: 'cover' }}
              />
              <div className="position-absolute top-0 end-0 translate-middle btn-group btn-group-sm">
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="btn btn-danger rounded-circle"
                  style={{ width: '28px', height: '28px', padding: 0 }}
                  title="Remove Image"
                >
                  <X className="h-3 w-3" />
                </button>
                {value && value.startsWith('data:image/') && (
                  <button
                    type="button"
                    onClick={handleCopyBase64}
                    className="btn btn-info rounded-circle"
                    style={{ width: '28px', height: '28px', padding: 0 }}
                    title="Copy Base64"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="flex-grow-1">
          <div className="mb-2">
            <input
              type="text"
              value={value}
              onChange={onTextChange}
              placeholder={placeholder}
              className="form-control"
            />
          </div>
          
          <div 
            className={`border rounded p-4 text-center mb-2 ${isDragging ? 'border-primary bg-primary bg-opacity-10' : 'border-dashed'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{ cursor: 'pointer' }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              className="d-none"
            />
            
            {isLoading ? (
              <div className="d-flex flex-column align-items-center justify-content-center">
                <RefreshCw className="h-8 w-8 animate-spin text-primary mb-2" />
                <span className="text-muted">Uploading...</span>
              </div>
            ) : (
              <div className="d-flex flex-column align-items-center justify-content-center">
                <Upload className="h-8 w-8 text-muted mb-2" />
                <div className="text-muted">
                  <div>Click to select or drag & drop</div>
                  <small>{helpText}</small>
                </div>
                {isDragging && (
                  <div className="mt-2 text-primary">
                    <Upload className="h-4 w-4 animate-bounce" /> Drop image here
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="d-flex gap-2 flex-wrap">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <Upload className="h-4 w-4" /> Browse
            </button>
            
            {value && (
              <>
                {/* <button
                  type="button"
                  onClick={() => {
                    const url = value.startsWith('http') ? value : value;
                    window.open(url, '_blank');
                  }}
                  className="btn btn-outline-secondary btn-sm"
                  title="View Image"
                  disabled={!value}
                >
                  <Eye className="h-4 w-4" />
                </button> */}
                
                <button
                  type="button"
                  onClick={() => {
                    if (value.startsWith('http')) {
                      navigator.clipboard.writeText(value)
                        .then(() => toast.success('URL copied'))
                        .catch(() => toast.error('Failed to copy'));
                    }
                  }}
                  className="btn btn-outline-secondary btn-sm"
                  title="Copy URL"
                  disabled={!value.startsWith('http')}
                >
                  <Copy className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
          
          <small className="text-muted d-block mt-2">
            {helpText}
            {value && value.startsWith('data:image/') && ' • Stored as Base64'}
            {value && value.startsWith('http') && ' • External URL'}
          </small>
        </div>
      </div>
    </div>
  );
});

ImageUploadField.displayName = 'ImageUploadField';

// Memoized FormSection component
const FormSection = memo(({ children, title, icon: Icon, color = 'primary' }) => (
  <div className="card shadow-sm border-0 mb-4">
    <div className="card-header bg-white border-bottom d-flex align-items-center py-3">
      <div className={`p-2 rounded bg-${color} bg-opacity-10 me-3`}>
        <Icon className={`h-5 w-5 text-${color}`} />
      </div>
      <h3 className="h5 mb-0 fw-semibold text-dark">{title}</h3>
    </div>
    <div className="card-body">
      {children}
    </div>
  </div>
));

FormSection.displayName = 'FormSection';

// Array Item Component for dynamic lists
const ArrayItem = memo(({ 
  item, 
  index, 
  fields,
  onFieldChange,
  onRemove, 
  canRemove,
  section,
  arrayField
}) => {
  const handleFieldChange = (field) => (e) => {
    onFieldChange(section, arrayField, index, field, e.target.value);
  };

  const handleNumberFieldChange = (field) => (e) => {
    onFieldChange(section, arrayField, index, field, parseInt(e.target.value) || 0);
  };

  const handleCheckboxChange = (field) => (e) => {
    onFieldChange(section, arrayField, index, field, e.target.checked);
  };

  return (
    <div className="col-12">
      <div className="card border">
        <div className="card-body p-3">
          <div className="row align-items-center">
            {fields.map((field, fieldIndex) => (
              <div key={fieldIndex} className={`col-md-${field.colSize || 12/fields.length} mb-2 mb-md-0`}>
                <label className="form-label small text-muted mb-1">
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={item[field.name] || ''}
                    onChange={handleFieldChange(field.name)}
                    placeholder={field.placeholder}
                    className="form-control form-control-sm"
                    required={field.required}
                    rows={field.rows || 2}
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={item[field.name] || ''}
                    onChange={handleFieldChange(field.name)}
                    className="form-select form-select-sm"
                    required={field.required}
                  >
                    {field.options?.map((option, optIndex) => (
                      <option key={optIndex} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'number' ? (
                  <input
                    type="number"
                    value={item[field.name] || ''}
                    onChange={handleNumberFieldChange(field.name)}
                    placeholder={field.placeholder}
                    className="form-control form-control-sm"
                    required={field.required}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                  />
                ) : field.type === 'checkbox' ? (
                  <div className="form-check">
                    <input
                      type="checkbox"
                      checked={item[field.name] || false}
                      onChange={handleCheckboxChange(field.name)}
                      className="form-check-input"
                      id={`${section}-${arrayField}-${index}-${field.name}`}
                    />
                    <label className="form-check-label" htmlFor={`${section}-${arrayField}-${index}-${field.name}`}>
                      {field.placeholder}
                    </label>
                  </div>
                ) : field.type === 'color' ? (
                  <input
                    type="color"
                    value={item[field.name] || '#4F46E5'}
                    onChange={handleFieldChange(field.name)}
                    className="form-control form-control-sm p-1"
                    style={{ height: '38px' }}
                  />
                ) : (
                  <input
                    type={field.type || 'text'}
                    value={item[field.name] || ''}
                    onChange={handleFieldChange(field.name)}
                    placeholder={field.placeholder}
                    className="form-control form-control-sm"
                    required={field.required}
                  />
                )}
              </div>
            ))}
            <div className="col-md-1 text-end">
              {canRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(section, arrayField, index)}
                  className="btn btn-outline-danger btn-sm"
                  title="Remove"
                >
                  <Minus className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ArrayItem.displayName = 'ArrayItem';

// Main Component
const HomePageManagement = () => {
  const [formData, setFormData] = useState({
    hero: {
      title: '',
      subtitle: '',
      search_placeholder: '',
      search_button: '',
      background_image: '',
      hero_image: ''
    },
    featured_categories: {
      title: '',
      subtitle: '',
      categories: []
    },
    start_learning: {
      title: '',
      subtitle: '',
      description: '',
      image: '',
      button_text: '',
      button_link: ''
    },
    cooking_section: {
      title: '',
      description: '',
      button_text: '',
      image: '',
      features: []
    },
    agriculture_section: {
      title: '',
      tagline: '',
      special_offer: '',
      description: '',
      image: '',
      button_text: '',
      button_link: ''
    },
    experts_section: {
      title: '',
      subtitle: '',
      experts: []
    },
    hobby_section: {
      title: '',
      subtitle: '',
      description: '',
      button_text: '',
      image: '',
      features: []
    },
    project_section: {
      title: '',
      description: '',
      image: '',
      button_text: '',
      button_link: ''
    },
    popular_products: {
      title: '',
      products: []
    },
    share_skill_cta: {
      title: '',
      journey_text: '',
      button_text: '',
      button_link: '',
      background_image: ''
    },
    why_choose_us: {
      title: '',
      features: []
    },
    statistics: {
      title: '',
      subtitle: '',
      stats: []
    },
    study_bit: {
      title: '',
      question: '',
      image: '',
      button_text: '',
      button_link: ''
    },
    testimonials: {
      title: '',
      subtitle: '',
      testimonials: []
    },
    footer: {
      company_name: '',
      email: '',
      phone: '',
      address: '',
      copyright: '',
      description: '',
      pages: [],
      important_links: [],
      social_profiles: []
    },
    seo: {
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      og_image: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imageUploading, setImageUploading] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('hero');
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setFetching(true);
    try {
      const response = await fetch(API_BASE_URL);
      const result = await response.json();
      
      if (result.success && result.data) {
        setFormData(result.data);
        setIsEditing(true);
        toast.success('Homepage data loaded successfully!');
      } else {
        toast.error('No homepage data found');
      }
    } catch (error) {
      toast.error('Failed to fetch homepage data');
      console.error('Fetch error:', error);
    } finally {
      setFetching(false);
    }
  };

  // Generic handlers
  const handleNestedChange = useCallback((section, field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  }, []);

  const handleArrayFieldChange = useCallback((section, arrayField, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [arrayField]: prev[section][arrayField].map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  }, []);

  const addArrayItem = useCallback((section, arrayField, defaultItem) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [arrayField]: [...prev[section][arrayField], defaultItem]
      }
    }));
  }, []);

  const removeArrayItem = useCallback((section, arrayField, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [arrayField]: prev[section][arrayField].filter((_, i) => i !== index)
      }
    }));
  }, []);

  const handleImageTextChange = useCallback((path) => (e) => {
    const value = e.target.value;
    const pathParts = path.split('.');
    
    if (pathParts.length === 2) {
      const [section, field] = pathParts;
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else if (pathParts.length === 3) {
      const [section, subSection, field] = pathParts;
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [subSection]: {
            ...prev[section][subSection],
            [field]: value
          }
        }
      }));
    }
  }, []);

  const handleImageFileUpload = useCallback(async (field, file) => {
    setImageUploading(field);
    
    try {
      const base64Image = await fileToBase64(file);
      const pathParts = field.split('.');
      
      if (pathParts.length === 2) {
        const [section, subField] = pathParts;
        setFormData(prev => ({
          ...prev,
          [section]: {
            ...prev[section],
            [subField]: base64Image
          }
        }));
      } else if (pathParts.length === 3) {
        const [section, subSection, subField] = pathParts;
        setFormData(prev => ({
          ...prev,
          [section]: {
            ...prev[section],
            [subSection]: {
              ...prev[section][subSection],
              [subField]: base64Image
            }
          }
        }));
      }
      
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setImageUploading(null);
    }
  }, []);

  const handleRemoveImage = useCallback((field) => {
    const pathParts = field.split('.');
    
    if (pathParts.length === 2) {
      const [section, subField] = pathParts;
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [subField]: ''
        }
      }));
    } else if (pathParts.length === 3) {
      const [section, subSection, subField] = pathParts;
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [subSection]: {
            ...prev[section][subSection],
            [subField]: ''
          }
        }
      }));
    }
    toast.success('Image removed');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(isEditing ? 'Homepage updated successfully!' : 'Homepage created successfully!');
        setIsEditing(true);
        setFormData(result.data);
      } else {
        toast.error(result.message || 'Failed to save homepage data');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to reset homepage to defaults?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reset`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Homepage reset to defaults!');
        setFormData(result.data);
      } else {
        toast.error(result.message || 'Failed to reset homepage');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      console.error('Delete error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: Home, color: 'primary' },
    { id: 'categories', label: 'Categories', icon: Target, color: 'success' },
    { id: 'learning', label: 'Start Learning', icon: BookOpen, color: 'info' },
    { id: 'cooking', label: 'Cooking Section', icon: Coffee, color: 'warning' },
    { id: 'agriculture', label: 'Agriculture', icon: Leaf, color: 'success' },
    { id: 'experts', label: 'Experts', icon: Users, color: 'danger' },
    { id: 'hobby', label: 'Hobby Section', icon: Scissors, color: 'secondary' },
    { id: 'projects', label: 'Projects', icon: Lightbulb, color: 'info' },
    { id: 'products', label: 'Popular Products', icon: ShoppingBag, color: 'primary' },
    { id: 'cta', label: 'Share Skill CTA', icon: Heart, color: 'danger' },
    { id: 'whyus', label: 'Why Choose Us', icon: Award, color: 'warning' },
    { id: 'stats', label: 'Statistics', icon: BarChart3, color: 'success' },
    { id: 'studybit', label: 'Study Bit', icon: Book, color: 'info' },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare, color: 'info' },
    { id: 'footer', label: 'Footer', icon: Globe, color: 'dark' },
    { id: 'seo', label: 'SEO Settings', icon: Search, color: 'secondary' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'hero':
        return (
          <FormSection title="Hero Section" icon={Home} color="primary">
            <div className="row">
              <div className="col-md-6">
                <InputField
                  label="Hero Title"
                  value={formData.hero.title}
                  onChange={handleNestedChange('hero', 'title')}
                  placeholder="Get Your Study Done"
                  required
                />
              </div>
              <div className="col-md-6">
                <InputField
                  label="Search Placeholder"
                  value={formData.hero.search_placeholder}
                  onChange={handleNestedChange('hero', 'search_placeholder')}
                  placeholder="I want to learn Mathematics"
                  required
                />
              </div>
            </div>
            
            <InputField
              label="Hero Subtitle"
              value={formData.hero.subtitle}
              onChange={handleNestedChange('hero', 'subtitle')}
              type="textarea"
              placeholder="Browse through Thousands of StudyBit. Choose one you trust. Pay as you go"
              required
            />
            
            <div className="row">
              <div className="col-md-6">
                <InputField
                  label="Search Button Text"
                  value={formData.hero.search_button}
                  onChange={handleNestedChange('hero', 'search_button')}
                  placeholder="Search Now"
                  required
                />
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <ImageUploadField
                  label="Background Image"
                  value={formData.hero.background_image}
                  onTextChange={handleImageTextChange('hero.background_image')}
                  onFileUpload={handleImageFileUpload}
                  field="hero.background_image"
                  placeholder="Enter background image URL or upload"
                  isLoading={imageUploading === 'hero.background_image'}
                  onRemove={handleRemoveImage}
                  previewSize={{ width: '100%', height: '200px' }}
                  helpText="Recommended: 1920x1080px • Hero background"
                />
              </div>
              <div className="col-md-6">
                <ImageUploadField
                  label="Hero Image (Optional)"
                  value={formData.hero.hero_image}
                  onTextChange={handleImageTextChange('hero.hero_image')}
                  onFileUpload={handleImageFileUpload}
                  field="hero.hero_image"
                  placeholder="Enter hero image URL or upload"
                  isLoading={imageUploading === 'hero.hero_image'}
                  onRemove={handleRemoveImage}
                  previewSize={{ width: '100%', height: '200px' }}
                  helpText="Recommended: 800x600px • Main hero image"
                />
              </div>
            </div>
          </FormSection>
        );

      case 'categories':
        return (
          <FormSection title="Featured Categories" icon={Target} color="success">
            <div className="row">
              <div className="col-md-6">
                <InputField
                  label="Section Title"
                  value={formData.featured_categories.title}
                  onChange={handleNestedChange('featured_categories', 'title')}
                  placeholder="Popular Categories"
                  required
                />
              </div>
              <div className="col-md-6">
                <InputField
                  label="Section Subtitle"
                  value={formData.featured_categories.subtitle}
                  onChange={handleNestedChange('featured_categories', 'subtitle')}
                  placeholder="Browse our top categories"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 d-flex align-items-center gap-2">
                  <Target className="h-5 w-5 text-success" />
                  Categories
                </h5>
                <button
                  type="button"
                  onClick={() => addArrayItem('featured_categories', 'categories', {
                    name: '',
                    icon: '',
                    courses_count: 0,
                    color: '#4F46E5',
                    description: ''
                  })}
                  className="btn btn-outline-success btn-sm d-flex align-items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Category
                </button>
              </div>
              
              <div className="row g-3">
                {formData.featured_categories.categories.map((category, index) => (
                  <div key={index} className="col-12">
                    <div className="card border">
                      <div className="card-body p-3">
                        <div className="row align-items-center">
                          <div className="col-md-3 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Name</label>
                            <input
                              type="text"
                              value={category.name}
                              onChange={(e) => handleArrayFieldChange('featured_categories', 'categories', index, 'name', e.target.value)}
                              placeholder="Smart Home Automation"
                              className="form-control form-control-sm"
                              required
                            />
                          </div>
                          <div className="col-md-2 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Icon URL</label>
                            <input
                              type="text"
                              value={category.icon}
                              onChange={(e) => handleArrayFieldChange('featured_categories', 'categories', index, 'icon', e.target.value)}
                              placeholder="/icons/smart-home.svg"
                              className="form-control form-control-sm"
                            />
                          </div>
                          <div className="col-md-2 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Courses</label>
                            <input
                              type="number"
                              value={category.courses_count}
                              onChange={(e) => handleArrayFieldChange('featured_categories', 'categories', index, 'courses_count', parseInt(e.target.value))}
                              placeholder="15"
                              className="form-control form-control-sm"
                              min="0"
                            />
                          </div>
                          <div className="col-md-2 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Color</label>
                            <input
                              type="color"
                              value={category.color || '#4F46E5'}
                              onChange={(e) => handleArrayFieldChange('featured_categories', 'categories', index, 'color', e.target.value)}
                              className="form-control form-control-sm p-1"
                              style={{ height: '38px' }}
                            />
                          </div>
                          <div className="col-md-2 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Description</label>
                            <input
                              type="text"
                              value={category.description || ''}
                              onChange={(e) => handleArrayFieldChange('featured_categories', 'categories', index, 'description', e.target.value)}
                              placeholder="Short description"
                              className="form-control form-control-sm"
                            />
                          </div>
                          <div className="col-md-1 text-end">
                            <button
                              type="button"
                              onClick={() => removeArrayItem('featured_categories', 'categories', index)}
                              className="btn btn-outline-danger btn-sm"
                              title="Remove"
                              disabled={formData.featured_categories.categories.length <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FormSection>
        );

      case 'learning':
        return (
          <FormSection title="Start Learning Section" icon={BookOpen} color="info">
            <div className="row">
              <div className="col-md-6">
                <InputField
                  label="Title"
                  value={formData.start_learning.title}
                  onChange={handleNestedChange('start_learning', 'title')}
                  placeholder="Start Learning Today"
                  required
                />
              </div>
              <div className="col-md-6">
                <InputField
                  label="Subtitle"
                  value={formData.start_learning.subtitle}
                  onChange={handleNestedChange('start_learning', 'subtitle')}
                  placeholder="500+ Learning Module Available"
                  required
                />
              </div>
            </div>
            
            <InputField
              label="Description"
              value={formData.start_learning.description}
              onChange={handleNestedChange('start_learning', 'description')}
              type="textarea"
              placeholder="Gain in-demand skills and knowledge through interactive and engaging online learning, and take the next step toward a successful future."
              required
              rows={3}
            />
            
            <div className="row">
              <div className="col-md-6">
                <InputField
                  label="Button Text"
                  value={formData.start_learning.button_text}
                  onChange={handleNestedChange('start_learning', 'button_text')}
                  placeholder="Start Learning"
                  required
                />
              </div>
              <div className="col-md-6">
                <InputField
                  label="Button Link"
                  value={formData.start_learning.button_link}
                  onChange={handleNestedChange('start_learning', 'button_link')}
                  placeholder="/courses"
                  required
                />
              </div>
            </div>
            
            <ImageUploadField
              label="Section Image"
              value={formData.start_learning.image}
              onTextChange={handleImageTextChange('start_learning.image')}
              onFileUpload={handleImageFileUpload}
              field="start_learning.image"
              placeholder="Enter image URL or upload"
              isLoading={imageUploading === 'start_learning.image'}
              onRemove={handleRemoveImage}
              previewSize={{ width: '100%', height: '200px' }}
              helpText="Recommended: 800x600px • Learning section image"
            />
          </FormSection>
        );

      case 'cooking':
        return (
          <FormSection title="Cooking & Recipes Section" icon={Coffee} color="warning">
            <div className="row">
              <div className="col-md-6">
                <InputField
                  label="Title"
                  value={formData.cooking_section.title}
                  onChange={handleNestedChange('cooking_section', 'title')}
                  placeholder="Your Guide to Cooking & Recipes"
                  required
                />
              </div>
              <div className="col-md-6">
                <InputField
                  label="Button Text"
                  value={formData.cooking_section.button_text}
                  onChange={handleNestedChange('cooking_section', 'button_text')}
                  placeholder="Start Learning"
                  required
                />
              </div>
            </div>
            
            <InputField
              label="Description"
              value={formData.cooking_section.description}
              onChange={handleNestedChange('cooking_section', 'description')}
              type="textarea"
              placeholder="Learn to cook delicious meals at home with easy-to-follow recipes and helpful kitchen tips. No experience needed — just a love for good food!"
              required
              rows={3}
            />
            
            <ImageUploadField
              label="Section Image"
              value={formData.cooking_section.image}
              onTextChange={handleImageTextChange('cooking_section.image')}
              onFileUpload={handleImageFileUpload}
              field="cooking_section.image"
              placeholder="Enter image URL or upload"
              isLoading={imageUploading === 'cooking_section.image'}
              onRemove={handleRemoveImage}
              previewSize={{ width: '100%', height: '200px' }}
              helpText="Recommended: 800x600px • Cooking section image"
            />
            
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 d-flex align-items-center gap-2">
                  <Coffee className="h-5 w-5 text-warning" />
                  Features
                </h5>
                <button
                  type="button"
                  onClick={() => addArrayItem('cooking_section', 'features', {
                    title: '',
                    subtitle: '',
                    icon: '',
                    description: ''
                  })}
                  className="btn btn-outline-warning btn-sm d-flex align-items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Feature
                </button>
              </div>
              
              <div className="row g-3">
                {formData.cooking_section.features.map((feature, index) => (
                  <div key={index} className="col-12">
                    <div className="card border">
                      <div className="card-body p-3">
                        <div className="row align-items-center">
                          <div className="col-md-3 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Title</label>
                            <input
                              type="text"
                              value={feature.title}
                              onChange={(e) => handleArrayFieldChange('cooking_section', 'features', index, 'title', e.target.value)}
                              placeholder="30-Minute Meals"
                              className="form-control form-control-sm"
                              required
                            />
                          </div>
                          <div className="col-md-3 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Subtitle</label>
                            <input
                              type="text"
                              value={feature.subtitle}
                              onChange={(e) => handleArrayFieldChange('cooking_section', 'features', index, 'subtitle', e.target.value)}
                              placeholder="Fast & Tasty"
                              className="form-control form-control-sm"
                            />
                          </div>
                          <div className="col-md-3 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Icon URL</label>
                            <input
                              type="text"
                              value={feature.icon}
                              onChange={(e) => handleArrayFieldChange('cooking_section', 'features', index, 'icon', e.target.value)}
                              placeholder="/icons/clock.svg"
                              className="form-control form-control-sm"
                            />
                          </div>
                          <div className="col-md-2 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Description</label>
                            <input
                              type="text"
                              value={feature.description || ''}
                              onChange={(e) => handleArrayFieldChange('cooking_section', 'features', index, 'description', e.target.value)}
                              placeholder="Quick meals"
                              className="form-control form-control-sm"
                            />
                          </div>
                          <div className="col-md-1 text-end">
                            <button
                              type="button"
                              onClick={() => removeArrayItem('cooking_section', 'features', index)}
                              className="btn btn-outline-danger btn-sm"
                              title="Remove"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FormSection>
        );

      case 'agriculture':
        return (
          <FormSection title="Agriculture Section" icon={Leaf} color="success">
            <div className="row">
              <div className="col-md-6">
                <InputField
                  label="Title"
                  value={formData.agriculture_section.title}
                  onChange={handleNestedChange('agriculture_section', 'title')}
                  placeholder="Grow Your Agriculture Skills"
                  required
                />
              </div>
              <div className="col-md-6">
                <InputField
                  label="Tagline"
                  value={formData.agriculture_section.tagline}
                  onChange={handleNestedChange('agriculture_section', 'tagline')}
                  placeholder="Harvest Knowledge, Not Just Crops!"
                  required
                />
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <InputField
                  label="Special Offer Text"
                  value={formData.agriculture_section.special_offer}
                  onChange={handleNestedChange('agriculture_section', 'special_offer')}
                  placeholder="Special Offer Inside!"
                />
              </div>
              <div className="col-md-6">
                <InputField
                  label="Button Text"
                  value={formData.agriculture_section.button_text}
                  onChange={handleNestedChange('agriculture_section', 'button_text')}
                  placeholder="Explore Courses"
                  required
                />
              </div>
            </div>
            
            <InputField
              label="Description"
              value={formData.agriculture_section.description}
              onChange={handleNestedChange('agriculture_section', 'description')}
              type="textarea"
              placeholder="100+ Experts & Enthusiasts Sharing Their Knowledge"
              required
              rows={3}
            />
            
            <div className="row">
              <div className="col-md-6">
                <InputField
                  label="Button Link"
                  value={formData.agriculture_section.button_link}
                  onChange={handleNestedChange('agriculture_section', 'button_link')}
                  placeholder="/courses/agriculture"
                  required
                />
              </div>
            </div>
            
            <ImageUploadField
              label="Section Image"
              value={formData.agriculture_section.image}
              onTextChange={handleImageTextChange('agriculture_section.image')}
              onFileUpload={handleImageFileUpload}
              field="agriculture_section.image"
              placeholder="Enter image URL or upload"
              isLoading={imageUploading === 'agriculture_section.image'}
              onRemove={handleRemoveImage}
              previewSize={{ width: '100%', height: '200px' }}
              helpText="Recommended: 800x600px • Agriculture section image"
            />
          </FormSection>
        );

      case 'experts':
        return (
          <FormSection title="Experts Section" icon={Users} color="danger">
            <div className="row">
              <div className="col-md-6">
                <InputField
                  label="Section Title"
                  value={formData.experts_section.title}
                  onChange={handleNestedChange('experts_section', 'title')}
                  placeholder="ooking to coding, explore real-world skills taught by passionate individuals."
                  required
                />
              </div>
              <div className="col-md-6">
                <InputField
                  label="Section Subtitle"
                  value={formData.experts_section.subtitle}
                  onChange={handleNestedChange('experts_section', 'subtitle')}
                  placeholder="Learn from industry experts"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 d-flex align-items-center gap-2">
                  <Users className="h-5 w-5 text-danger" />
                  Experts
                </h5>
                <button
                  type="button"
                  onClick={() => addArrayItem('experts_section', 'experts', {
                    name: '',
                    role: '',
                    avatar: '',
                    bio: ''
                  })}
                  className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Expert
                </button>
              </div>
              
              <div className="row g-3">
                {formData.experts_section.experts.map((expert, index) => (
                  <div key={index} className="col-12">
                    <div className="card border">
                      <div className="card-body p-3">
                        <div className="row align-items-center">
                          <div className="col-md-3 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Name</label>
                            <input
                              type="text"
                              value={expert.name}
                              onChange={(e) => handleArrayFieldChange('experts_section', 'experts', index, 'name', e.target.value)}
                              placeholder="Wade Warren"
                              className="form-control form-control-sm"
                              required
                            />
                          </div>
                          <div className="col-md-3 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Role</label>
                            <input
                              type="text"
                              value={expert.role}
                              onChange={(e) => handleArrayFieldChange('experts_section', 'experts', index, 'role', e.target.value)}
                              placeholder="Ethical Hacker"
                              className="form-control form-control-sm"
                              required
                            />
                          </div>
                          <div className="col-md-3 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Avatar URL</label>
                            <input
                              type="text"
                              value={expert.avatar}
                              onChange={(e) => handleArrayFieldChange('experts_section', 'experts', index, 'avatar', e.target.value)}
                              placeholder="/avatars/expert.jpg"
                              className="form-control form-control-sm"
                            />
                          </div>
                          <div className="col-md-2 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Bio</label>
                            <input
                              type="text"
                              value={expert.bio || ''}
                              onChange={(e) => handleArrayFieldChange('experts_section', 'experts', index, 'bio', e.target.value)}
                              placeholder="Expert bio"
                              className="form-control form-control-sm"
                            />
                          </div>
                          <div className="col-md-1 text-end">
                            <button
                              type="button"
                              onClick={() => removeArrayItem('experts_section', 'experts', index)}
                              className="btn btn-outline-danger btn-sm"
                              title="Remove"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        {expert.avatar && (
                          <div className="mt-2">
                            <img 
                              src={expert.avatar} 
                              alt={expert.name}
                              className="rounded"
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FormSection>
        );

      case 'hobby':
        return (
          <FormSection title="Hobby Section" icon={Scissors} color="secondary">
            <div className="row">
              <div className="col-md-6">
                <InputField
                  label="Title"
                  value={formData.hobby_section.title}
                  onChange={handleNestedChange('hobby_section', 'title')}
                  placeholder="From Hobby To Hustle"
                  required
                />
              </div>
              <div className="col-md-6">
                <InputField
                  label="Subtitle"
                  value={formData.hobby_section.subtitle}
                  onChange={handleNestedChange('hobby_section', 'subtitle')}
                  placeholder="Start Stitching Now!"
                  required
                />
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <InputField
                  label="Description"
                  value={formData.hobby_section.description}
                  onChange={handleNestedChange('hobby_section', 'description')}
                  placeholder="Sewing and tailoring"
                  required
                />
              </div>
              <div className="col-md-6">
                <InputField
                  label="Button Text"
                  value={formData.hobby_section.button_text}
                  onChange={handleNestedChange('hobby_section', 'button_text')}
                  placeholder="Start Learning"
                  required
                />
              </div>
            </div>
            
            <ImageUploadField
              label="Section Image"
              value={formData.hobby_section.image}
              onTextChange={handleImageTextChange('hobby_section.image')}
              onFileUpload={handleImageFileUpload}
              field="hobby_section.image"
              placeholder="Enter image URL or upload"
              isLoading={imageUploading === 'hobby_section.image'}
              onRemove={handleRemoveImage}
              previewSize={{ width: '100%', height: '200px' }}
              helpText="Recommended: 800x600px • Hobby section image"
            />
            
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 d-flex align-items-center gap-2">
                  <Scissors className="h-5 w-5 text-secondary" />
                  Features
                </h5>
                <button
                  type="button"
                  onClick={() => addArrayItem('hobby_section', 'features', {
                    title: '',
                    subtitle: '',
                    icon: '',
                    description: ''
                  })}
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Feature
                </button>
              </div>
              
              <div className="row g-3">
                {formData.hobby_section.features.map((feature, index) => (
                  <div key={index} className="col-12">
                    <div className="card border">
                      <div className="card-body p-3">
                        <div className="row align-items-center">
                          <div className="col-md-4 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Title</label>
                            <input
                              type="text"
                              value={feature.title}
                              onChange={(e) => handleArrayFieldChange('hobby_section', 'features', index, 'title', e.target.value)}
                              placeholder="Feature Title"
                              className="form-control form-control-sm"
                              required
                            />
                          </div>
                          <div className="col-md-4 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Subtitle</label>
                            <input
                              type="text"
                              value={feature.subtitle}
                              onChange={(e) => handleArrayFieldChange('hobby_section', 'features', index, 'subtitle', e.target.value)}
                              placeholder="Feature subtitle"
                              className="form-control form-control-sm"
                            />
                          </div>
                          <div className="col-md-3 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Icon URL</label>
                            <input
                              type="text"
                              value={feature.icon}
                              onChange={(e) => handleArrayFieldChange('hobby_section', 'features', index, 'icon', e.target.value)}
                              placeholder="/icons/feature.svg"
                              className="form-control form-control-sm"
                            />
                          </div>
                          <div className="col-md-1 text-end">
                            <button
                              type="button"
                              onClick={() => removeArrayItem('hobby_section', 'features', index)}
                              className="btn btn-outline-danger btn-sm"
                              title="Remove"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FormSection>
        );

      case 'projects':
        return (
          <FormSection title="Projects Section" icon={Lightbulb} color="info">
            <div className="row">
              <div className="col-md-6">
                <InputField
                  label="Title"
                  value={formData.project_section.title}
                  onChange={handleNestedChange('project_section', 'title')}
                  placeholder="Turn Your Project Idea into Reality."
                  required
                />
              </div>
              <div className="col-md-6">
                <InputField
                  label="Button Text"
                  value={formData.project_section.button_text}
                  onChange={handleNestedChange('project_section', 'button_text')}
                  placeholder="Start Project"
                  required
                />
              </div>
            </div>
            
            <InputField
              label="Description"
              value={formData.project_section.description}
              onChange={handleNestedChange('project_section', 'description')}
              type="textarea"
              placeholder="Build Smarter Projects with Expert Support. Collaborate with experienced mentors and access the tools you need to succeed."
              required
              rows={3}
            />
            
            <div className="row">
              <div className="col-md-6">
                <InputField
                  label="Button Link"
                  value={formData.project_section.button_link}
                  onChange={handleNestedChange('project_section', 'button_link')}
                  placeholder="/projects"
                  required
                />
              </div>
            </div>
            
            <ImageUploadField
              label="Section Image"
              value={formData.project_section.image}
              onTextChange={handleImageTextChange('project_section.image')}
              onFileUpload={handleImageFileUpload}
              field="project_section.image"
              placeholder="Enter image URL or upload"
              isLoading={imageUploading === 'project_section.image'}
              onRemove={handleRemoveImage}
              previewSize={{ width: '100%', height: '200px' }}
              helpText="Recommended: 800x600px • Projects section image"
            />
          </FormSection>
        );

      case 'products':
        return (
          <FormSection title="Popular Products" icon={ShoppingBag} color="primary">
            <InputField
              label="Section Title"
              value={formData.popular_products.title}
              onChange={handleNestedChange('popular_products', 'title')}
              placeholder="Popular Products"
              required
            />
            
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 d-flex align-items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  Products
                </h5>
                <button
                  type="button"
                  onClick={() => addArrayItem('popular_products', 'products', {
                    name: '',
                    icon: '',
                    courses_count: 3,
                    description: ''
                  })}
                  className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </button>
              </div>
              
              <div className="row g-3">
                {formData.popular_products.products.map((product, index) => (
                  <div key={index} className="col-12">
                    <div className="card border">
                      <div className="card-body p-3">
                        <div className="row align-items-center">
                          <div className="col-md-3 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Product Name</label>
                            <input
                              type="text"
                              value={product.name}
                              onChange={(e) => handleArrayFieldChange('popular_products', 'products', index, 'name', e.target.value)}
                              placeholder="Communication"
                              className="form-control form-control-sm"
                              required
                            />
                          </div>
                          <div className="col-md-3 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Icon URL</label>
                            <input
                              type="text"
                              value={product.icon}
                              onChange={(e) => handleArrayFieldChange('popular_products', 'products', index, 'icon', e.target.value)}
                              placeholder="/icons/communication.svg"
                              className="form-control form-control-sm"
                            />
                          </div>
                          <div className="col-md-2 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Courses Count</label>
                            <input
                              type="number"
                              value={product.courses_count}
                              onChange={(e) => handleArrayFieldChange('popular_products', 'products', index, 'courses_count', parseInt(e.target.value))}
                              placeholder="3"
                              className="form-control form-control-sm"
                              min="0"
                            />
                          </div>
                          <div className="col-md-3 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Description</label>
                            <input
                              type="text"
                              value={product.description || ''}
                              onChange={(e) => handleArrayFieldChange('popular_products', 'products', index, 'description', e.target.value)}
                              placeholder="Product description"
                              className="form-control form-control-sm"
                            />
                          </div>
                          <div className="col-md-1 text-end">
                            <button
                              type="button"
                              onClick={() => removeArrayItem('popular_products', 'products', index)}
                              className="btn btn-outline-danger btn-sm"
                              title="Remove"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FormSection>
        );

      case 'cta':
        return (
          <FormSection title="Share Skill CTA" icon={Heart} color="danger">
            <div className="row">
              <div className="col-md-6">
                <InputField
                  label="Title"
                  value={formData.share_skill_cta.title}
                  onChange={handleNestedChange('share_skill_cta', 'title')}
                  placeholder="Want to share your skill?"
                  required
                />
              </div>
              <div className="col-md-6">
                <InputField
                  label="Button Text"
                  value={formData.share_skill_cta.button_text}
                  onChange={handleNestedChange('share_skill_cta', 'button_text')}
                  placeholder="Start Learning"
                  required
                />
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <InputField
                  label="Journey Text"
                  value={formData.share_skill_cta.journey_text}
                  onChange={handleNestedChange('share_skill_cta', 'journey_text')}
                  placeholder="Your Learning Journey Starts Here"
                  required
                />
              </div>
              <div className="col-md-6">
                <InputField
                  label="Button Link"
                  value={formData.share_skill_cta.button_link}
                  onChange={handleNestedChange('share_skill_cta', 'button_link')}
                  placeholder="/become-instructor"
                  required
                />
              </div>
            </div>
            
            <ImageUploadField
              label="Background Image"
              value={formData.share_skill_cta.background_image}
              onTextChange={handleImageTextChange('share_skill_cta.background_image')}
              onFileUpload={handleImageFileUpload}
              field="share_skill_cta.background_image"
              placeholder="Enter background image URL or upload"
              isLoading={imageUploading === 'share_skill_cta.background_image'}
              onRemove={handleRemoveImage}
              previewSize={{ width: '100%', height: '200px' }}
              helpText="Recommended: 1920x1080px • CTA background"
            />
          </FormSection>
        );

      case 'whyus':
        return (
          <FormSection title="Why Choose Us" icon={Award} color="warning">
            <InputField
              label="Section Title"
              value={formData.why_choose_us.title}
              onChange={handleNestedChange('why_choose_us', 'title')}
              placeholder="Why works with Shekhai?"
              required
            />
            
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 d-flex align-items-center gap-2">
                  <Award className="h-5 w-5 text-warning" />
                  Features
                </h5>
                <button
                  type="button"
                  onClick={() => addArrayItem('why_choose_us', 'features', {
                    title: '',
                    description: '',
                    icon: ''
                  })}
                  className="btn btn-outline-warning btn-sm d-flex align-items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Feature
                </button>
              </div>
              
              <div className="row g-3">
                {formData.why_choose_us.features.map((feature, index) => (
                  <div key={index} className="col-12">
                    <div className="card border">
                      <div className="card-body p-3">
                        <div className="row align-items-center">
                          <div className="col-md-4 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Title</label>
                            <input
                              type="text"
                              value={feature.title}
                              onChange={(e) => handleArrayFieldChange('why_choose_us', 'features', index, 'title', e.target.value)}
                              placeholder="On-demand tutoring"
                              className="form-control form-control-sm"
                              required
                            />
                          </div>
                          <div className="col-md-5 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Description</label>
                            <input
                              type="text"
                              value={feature.description}
                              onChange={(e) => handleArrayFieldChange('why_choose_us', 'features', index, 'description', e.target.value)}
                              placeholder="Connect with an online tutor"
                              className="form-control form-control-sm"
                              required
                            />
                          </div>
                          <div className="col-md-2 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Icon URL</label>
                            <input
                              type="text"
                              value={feature.icon}
                              onChange={(e) => handleArrayFieldChange('why_choose_us', 'features', index, 'icon', e.target.value)}
                              placeholder="/icons/tutoring.svg"
                              className="form-control form-control-sm"
                            />
                          </div>
                          <div className="col-md-1 text-end">
                            <button
                              type="button"
                              onClick={() => removeArrayItem('why_choose_us', 'features', index)}
                              className="btn btn-outline-danger btn-sm"
                              title="Remove"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FormSection>
        );

      case 'stats':
        return (
          <FormSection title="Statistics Section" icon={BarChart3} color="success">
            <div className="row">
              <div className="col-md-6">
                <InputField
                  label="Section Title"
                  value={formData.statistics.title}
                  onChange={handleNestedChange('statistics', 'title')}
                  placeholder="Our Achievements"
                />
              </div>
              <div className="col-md-6">
                <InputField
                  label="Section Subtitle"
                  value={formData.statistics.subtitle}
                  onChange={handleNestedChange('statistics', 'subtitle')}
                  placeholder="Numbers that speak for themselves"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 d-flex align-items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-success" />
                  Statistics
                </h5>
                <button
                  type="button"
                  onClick={() => addArrayItem('statistics', 'stats', {
                    label: '',
                    value: 0,
                    icon: '',
                    suffix: '+'
                  })}
                  className="btn btn-outline-success btn-sm d-flex align-items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Statistic
                </button>
              </div>
              
              <div className="row g-3">
                {formData.statistics.stats.map((stat, index) => (
                  <div key={index} className="col-12">
                    <div className="card border">
                      <div className="card-body p-3">
                        <div className="row align-items-center">
                          <div className="col-md-3 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Label</label>
                            <input
                              type="text"
                              value={stat.label}
                              onChange={(e) => handleArrayFieldChange('statistics', 'stats', index, 'label', e.target.value)}
                              placeholder="Exclusive Mentors"
                              className="form-control form-control-sm"
                              required
                            />
                          </div>
                          <div className="col-md-2 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Value</label>
                            <input
                              type="number"
                              value={stat.value}
                              onChange={(e) => handleArrayFieldChange('statistics', 'stats', index, 'value', parseInt(e.target.value))}
                              placeholder="200"
                              className="form-control form-control-sm"
                              min="0"
                              required
                            />
                          </div>
                          <div className="col-md-2 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Icon</label>
                            <input
                              type="text"
                              value={stat.icon}
                              onChange={(e) => handleArrayFieldChange('statistics', 'stats', index, 'icon', e.target.value)}
                              placeholder="users"
                              className="form-control form-control-sm"
                            />
                          </div>
                          <div className="col-md-2 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Suffix</label>
                            <input
                              type="text"
                              value={stat.suffix}
                              onChange={(e) => handleArrayFieldChange('statistics', 'stats', index, 'suffix', e.target.value)}
                              placeholder="+"
                              className="form-control form-control-sm"
                            />
                          </div>
                          <div className="col-md-2 mb-2 mb-md-0">
                            <div className="form-check">
                              <input
                                type="checkbox"
                                checked={stat.animate || false}
                                onChange={(e) => handleArrayFieldChange('statistics', 'stats', index, 'animate', e.target.checked)}
                                className="form-check-input"
                                id={`stat-animate-${index}`}
                              />
                              <label className="form-check-label small text-muted" htmlFor={`stat-animate-${index}`}>
                                Animate
                              </label>
                            </div>
                          </div>
                          <div className="col-md-1 text-end">
                            <button
                              type="button"
                              onClick={() => removeArrayItem('statistics', 'stats', index)}
                              className="btn btn-outline-danger btn-sm"
                              title="Remove"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FormSection>
        );

      case 'studybit':
        return (
          <FormSection title="Study Bit Section" icon={Book} color="info">
            <div className="row">
              <div className="col-md-6">
                <InputField
                  label="Title"
                  value={formData.study_bit.title}
                  onChange={handleNestedChange('study_bit', 'title')}
                  placeholder="Study Bit"
                  required
                />
              </div>
              <div className="col-md-6">
                <InputField
                  label="Question"
                  value={formData.study_bit.question}
                  onChange={handleNestedChange('study_bit', 'question')}
                  placeholder="Which skill to learn?"
                  required
                />
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <InputField
                  label="Button Text"
                  value={formData.study_bit.button_text}
                  onChange={handleNestedChange('study_bit', 'button_text')}
                  placeholder="Browse Skills"
                  required
                />
              </div>
              <div className="col-md-6">
                <InputField
                  label="Button Link"
                  value={formData.study_bit.button_link}
                  onChange={handleNestedChange('study_bit', 'button_link')}
                  placeholder="/skills"
                  required
                />
              </div>
            </div>
            
            <ImageUploadField
              label="Section Image"
              value={formData.study_bit.image}
              onTextChange={handleImageTextChange('study_bit.image')}
              onFileUpload={handleImageFileUpload}
              field="study_bit.image"
              placeholder="Enter image URL or upload"
              isLoading={imageUploading === 'study_bit.image'}
              onRemove={handleRemoveImage}
              previewSize={{ width: '100%', height: '200px' }}
              helpText="Recommended: 800x600px • Study bit image"
            />
          </FormSection>
        );

      case 'testimonials':
        return (
          <FormSection title="Testimonials Section" icon={MessageSquare} color="info">
            <div className="row">
              <div className="col-md-6">
                <InputField
                  label="Section Title"
                  value={formData.testimonials.title}
                  onChange={handleNestedChange('testimonials', 'title')}
                  placeholder="Hear from Our Learners!"
                  required
                />
              </div>
              <div className="col-md-6">
                <InputField
                  label="Section Subtitle"
                  value={formData.testimonials.subtitle}
                  onChange={handleNestedChange('testimonials', 'subtitle')}
                  placeholder="Discover how our students have transformed their learning journey with us."
                  required
                />
              </div>
            </div>
            
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 d-flex align-items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-info" />
                  Testimonials
                </h5>
                <button
                  type="button"
                  onClick={() => addArrayItem('testimonials', 'testimonials', {
                    name: '',
                    role: '',
                    avatar: '',
                    content: '',
                    rating: 5
                  })}
                  className="btn btn-outline-info btn-sm d-flex align-items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Testimonial
                </button>
              </div>
              
              <div className="row g-3">
                {formData.testimonials.testimonials.map((testimonial, index) => (
                  <div key={index} className="col-12">
                    <div className="card border">
                      <div className="card-body p-3">
                        <div className="row align-items-center">
                          <div className="col-md-3 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Name</label>
                            <input
                              type="text"
                              value={testimonial.name}
                              onChange={(e) => handleArrayFieldChange('testimonials', 'testimonials', index, 'name', e.target.value)}
                              placeholder="John Doe"
                              className="form-control form-control-sm"
                              required
                            />
                          </div>
                          <div className="col-md-3 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Role</label>
                            <input
                              type="text"
                              value={testimonial.role}
                              onChange={(e) => handleArrayFieldChange('testimonials', 'testimonials', index, 'role', e.target.value)}
                              placeholder="Web Developer"
                              className="form-control form-control-sm"
                              required
                            />
                          </div>
                          <div className="col-md-2 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Rating</label>
                            <select
                              value={testimonial.rating}
                              onChange={(e) => handleArrayFieldChange('testimonials', 'testimonials', index, 'rating', parseInt(e.target.value))}
                              className="form-select form-select-sm"
                            >
                              {[1, 2, 3, 4, 5].map(num => (
                                <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-md-3 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Avatar URL</label>
                            <input
                              type="text"
                              value={testimonial.avatar}
                              onChange={(e) => handleArrayFieldChange('testimonials', 'testimonials', index, 'avatar', e.target.value)}
                              placeholder="/avatars/john.jpg"
                              className="form-control form-control-sm"
                            />
                          </div>
                          <div className="col-md-1 text-end">
                            <button
                              type="button"
                              onClick={() => removeArrayItem('testimonials', 'testimonials', index)}
                              className="btn btn-outline-danger btn-sm"
                              title="Remove"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="row mt-2">
                          <div className="col-12">
                            <label className="form-label small text-muted mb-1">Content</label>
                            <textarea
                              value={testimonial.content}
                              onChange={(e) => handleArrayFieldChange('testimonials', 'testimonials', index, 'content', e.target.value)}
                              placeholder="Share their experience..."
                              className="form-control form-control-sm"
                              rows={2}
                              required
                            />
                          </div>
                        </div>
                        {testimonial.avatar && (
                          <div className="mt-2">
                            <img 
                              src={testimonial.avatar} 
                              alt={testimonial.name}
                              className="rounded"
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FormSection>
        );

      case 'footer':
        return (
          <FormSection title="Footer Section" icon={Globe} color="dark">
            <div className="row">
              <div className="col-md-4">
                <InputField
                  label="Company Name"
                  value={formData.footer.company_name}
                  onChange={handleNestedChange('footer', 'company_name')}
                  placeholder="SHEKHAI"
                  required
                  icon={Globe}
                />
              </div>
              <div className="col-md-4">
                <InputField
                  label="Email"
                  value={formData.footer.email}
                  onChange={handleNestedChange('footer', 'email')}
                  placeholder="hello@sekhai.com"
                  required
                  icon={Mail}
                />
              </div>
              <div className="col-md-4">
                <InputField
                  label="Phone"
                  value={formData.footer.phone}
                  onChange={handleNestedChange('footer', 'phone')}
                  placeholder="(603) 555-0123"
                  required
                  icon={Phone}
                />
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <InputField
                  label="Address"
                  value={formData.footer.address}
                  onChange={handleNestedChange('footer', 'address')}
                  placeholder="9 Mohammadpur, Dhaka"
                  required
                  icon={MapPin}
                />
              </div>
              <div className="col-md-6">
                <InputField
                  label="Copyright Text"
                  value={formData.footer.copyright}
                  onChange={handleNestedChange('footer', 'copyright')}
                  placeholder="© 2025 Shekhai. All rights reserved."
                  required
                />
              </div>
            </div>
            
            <InputField
              label="Footer Description"
              value={formData.footer.description}
              onChange={handleNestedChange('footer', 'description')}
              type="textarea"
              placeholder="Brief description about the company"
              rows={2}
            />
            
            {/* Page Links */}
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 d-flex align-items-center gap-2">
                  <Link className="h-5 w-5 text-secondary" />
                  Page Links
                </h5>
                <button
                  type="button"
                  onClick={() => addArrayItem('footer', 'pages', {
                    title: '',
                    link: ''
                  })}
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Page Link
                </button>
              </div>
              
              <div className="row g-2">
                {formData.footer.pages.map((page, index) => (
                  <div key={index} className="col-12">
                    <div className="card border">
                      <div className="card-body p-3">
                        <div className="row align-items-center">
                          <div className="col-md-5 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Title</label>
                            <input
                              type="text"
                              value={page.title}
                              onChange={(e) => handleArrayFieldChange('footer', 'pages', index, 'title', e.target.value)}
                              placeholder="Courses"
                              className="form-control form-control-sm"
                              required
                            />
                          </div>
                          <div className="col-md-5 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Link</label>
                            <input
                              type="text"
                              value={page.link}
                              onChange={(e) => handleArrayFieldChange('footer', 'pages', index, 'link', e.target.value)}
                              placeholder="/courses"
                              className="form-control form-control-sm"
                              required
                            />
                          </div>
                          <div className="col-md-2 text-end">
                            <button
                              type="button"
                              onClick={() => removeArrayItem('footer', 'pages', index)}
                              className="btn btn-outline-danger btn-sm"
                              title="Remove"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Important Links */}
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 d-flex align-items-center gap-2">
                  <FileText className="h-5 w-5 text-secondary" />
                  Important Links
                </h5>
                <button
                  type="button"
                  onClick={() => addArrayItem('footer', 'important_links', {
                    title: '',
                    link: ''
                  })}
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Important Link
                </button>
              </div>
              
              <div className="row g-2">
                {formData.footer.important_links.map((link, index) => (
                  <div key={index} className="col-12">
                    <div className="card border">
                      <div className="card-body p-3">
                        <div className="row align-items-center">
                          <div className="col-md-5 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Title</label>
                            <input
                              type="text"
                              value={link.title}
                              onChange={(e) => handleArrayFieldChange('footer', 'important_links', index, 'title', e.target.value)}
                              placeholder="Privacy Policy"
                              className="form-control form-control-sm"
                              required
                            />
                          </div>
                          <div className="col-md-5 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Link</label>
                            <input
                              type="text"
                              value={link.link}
                              onChange={(e) => handleArrayFieldChange('footer', 'important_links', index, 'link', e.target.value)}
                              placeholder="/privacy"
                              className="form-control form-control-sm"
                              required
                            />
                          </div>
                          <div className="col-md-2 text-end">
                            <button
                              type="button"
                              onClick={() => removeArrayItem('footer', 'important_links', index)}
                              className="btn btn-outline-danger btn-sm"
                              title="Remove"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Social Profiles */}
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 d-flex align-items-center gap-2">
                  <Facebook className="h-5 w-5 text-secondary" />
                  Social Profiles
                </h5>
                <button
                  type="button"
                  onClick={() => addArrayItem('footer', 'social_profiles', {
                    platform: 'Facebook',
                    icon: 'facebook',
                    link: ''
                  })}
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Social Profile
                </button>
              </div>
              
              <div className="row g-2">
                {formData.footer.social_profiles.map((social, index) => (
                  <div key={index} className="col-12">
                    <div className="card border">
                      <div className="card-body p-3">
                        <div className="row align-items-center">
                          <div className="col-md-3 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Platform</label>
                            <select
                              value={social.platform}
                              onChange={(e) => handleArrayFieldChange('footer', 'social_profiles', index, 'platform', e.target.value)}
                              className="form-select form-select-sm"
                            >
                              <option value="Facebook">Facebook</option>
                              <option value="Twitter">Twitter</option>
                              <option value="Instagram">Instagram</option>
                              <option value="LinkedIn">LinkedIn</option>
                              <option value="YouTube">YouTube</option>
                              <option value="TikTok">TikTok</option>
                              <option value="GitHub">GitHub</option>
                              <option value="Discord">Discord</option>
                            </select>
                          </div>
                          <div className="col-md-2 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Icon</label>
                            <input
                              type="text"
                              value={social.icon}
                              onChange={(e) => handleArrayFieldChange('footer', 'social_profiles', index, 'icon', e.target.value)}
                              placeholder="facebook"
                              className="form-control form-control-sm"
                              required
                            />
                          </div>
                          <div className="col-md-5 mb-2 mb-md-0">
                            <label className="form-label small text-muted mb-1">Link</label>
                            <input
                              type="text"
                              value={social.link}
                              onChange={(e) => handleArrayFieldChange('footer', 'social_profiles', index, 'link', e.target.value)}
                              placeholder="https://facebook.com/shekhai"
                              className="form-control form-control-sm"
                              required
                            />
                          </div>
                          <div className="col-md-2 text-end">
                            <button
                              type="button"
                              onClick={() => removeArrayItem('footer', 'social_profiles', index)}
                              className="btn btn-outline-danger btn-sm"
                              title="Remove"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FormSection>
        );

      case 'seo':
        return (
          <FormSection title="SEO Settings" icon={Search} color="secondary">
            <div className="row">
              <div className="col-md-6">
                <InputField
                  label="Meta Title"
                  value={formData.seo.meta_title}
                  onChange={handleNestedChange('seo', 'meta_title')}
                  placeholder="Shekhai - Online Learning Platform"
                  required
                />
              </div>
              <div className="col-md-6">
                <InputField
                  label="Meta Keywords"
                  value={formData.seo.meta_keywords}
                  onChange={handleNestedChange('seo', 'meta_keywords')}
                  placeholder="online courses, learning, skills, education"
                  required
                />
              </div>
            </div>
            
            <InputField
              label="Meta Description"
              value={formData.seo.meta_description}
              onChange={handleNestedChange('seo', 'meta_description')}
              type="textarea"
              placeholder="Learn new skills with Shekhai online courses. Join thousands of students learning programming, design, business, and more."
              required
              rows={3}
            />
            
            <ImageUploadField
              label="Open Graph Image"
              value={formData.seo.og_image}
              onTextChange={handleImageTextChange('seo.og_image')}
              onFileUpload={handleImageFileUpload}
              field="seo.og_image"
              placeholder="Enter OG image URL or upload"
              isLoading={imageUploading === 'seo.og_image'}
              onRemove={handleRemoveImage}
              previewSize={{ width: '100%', height: '200px' }}
              helpText="Recommended: 1200x630px • Open Graph image for social sharing"
            />
          </FormSection>
        );

      default:
        return (
          <FormSection title="Select a Section" icon={Settings} color="primary">
            <div className="text-center py-5">
              <Home className="h-12 w-12 text-muted mx-auto mb-3" />
              <h4 className="text-muted">Select a section from the sidebar to edit</h4>
              <p className="text-muted">Choose any section to view and edit its content</p>
            </div>
          </FormSection>
        );
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `homepage-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Data exported successfully!');
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        setFormData(importedData);
        toast.success('Data imported successfully!');
      } catch (error) {
        toast.error('Invalid JSON file');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    e.target.value = '';
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Top Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
        <div className="container-fluid">
          <button
            className="btn btn-light me-3"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
          </button>
          
          <div className="navbar-brand">
            <h1 className="h4 mb-0 fw-bold text-dark">Homepage Manager</h1>
            <small className="text-muted">Manage all homepage sections</small>
          </div>
          
          <div className="d-flex align-items-center ms-auto gap-2">
            <button
              onClick={fetchData}
              disabled={fetching}
              className="btn btn-outline-secondary d-flex align-items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${fetching ? 'animate-spin' : ''}`} />
              {fetching ? 'Loading...' : 'Refresh'}
            </button>
            
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-outline-primary d-flex align-items-center gap-2"
                onClick={handleExportData}
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <label className="btn btn-outline-primary d-flex align-items-center gap-2" htmlFor="importFile">
                <UploadCloud className="h-4 w-4" />
                Import
                <input
                  type="file"
                  id="importFile"
                  accept=".json"
                  onChange={handleImportData}
                  className="d-none"
                />
              </label>
            </div>
            
            <div className={`badge d-flex align-items-center gap-2 ${isEditing ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`}>
              <div className={`rounded-circle ${isEditing ? 'bg-success' : 'bg-warning'}`} style={{ width: '8px', height: '8px' }}></div>
              <span className="fw-medium">{isEditing ? 'Data Exists' : 'No Data'}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container-fluid py-4">
        <div className="row">
          {/* Sidebar */}
          {sidebarOpen && (
            <div className="col-lg-3 col-xl-2 mb-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h6 className="text-uppercase text-muted mb-3 fw-semibold">Sections</h6>
                  <nav className="nav flex-column gap-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`nav-link text-start d-flex align-items-center gap-3 py-2 rounded ${activeTab === tab.id ? `active bg-${tab.color} bg-opacity-10 text-${tab.color} border-start border-${tab.color} border-3` : 'text-dark'}`}
                      >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                        <ChevronRight className="h-3 w-3 ms-auto" />
                      </button>
                    ))}
                  </nav>
                  
                  <hr className="my-4" />
                  
                  <h6 className="text-uppercase text-muted mb-3 fw-semibold">Actions</h6>
                  <div className="d-grid gap-2">
                    <button
                      onClick={handleDelete}
                      disabled={loading || !isEditing}
                      className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Reset to Defaults
                    </button>
                    
                    <button
                      onClick={() => {
                        if (window.confirm('Clear all form data?')) {
                          setFormData({
                            hero: { title: '', subtitle: '', search_placeholder: '', search_button: '', background_image: '', hero_image: '' },
                            featured_categories: { title: '', subtitle: '', categories: [] },
                            start_learning: { title: '', subtitle: '', description: '', image: '', button_text: '', button_link: '' },
                            cooking_section: { title: '', description: '', button_text: '', image: '', features: [] },
                            agriculture_section: { title: '', tagline: '', special_offer: '', description: '', image: '', button_text: '', button_link: '' },
                            experts_section: { title: '', subtitle: '', experts: [] },
                            hobby_section: { title: '', subtitle: '', description: '', button_text: '', image: '', features: [] },
                            project_section: { title: '', description: '', image: '', button_text: '', button_link: '' },
                            popular_products: { title: '', products: [] },
                            share_skill_cta: { title: '', journey_text: '', button_text: '', button_link: '', background_image: '' },
                            why_choose_us: { title: '', features: [] },
                            statistics: { title: '', subtitle: '', stats: [] },
                            study_bit: { title: '', question: '', image: '', button_text: '', button_link: '' },
                            testimonials: { title: '', subtitle: '', testimonials: [] },
                            footer: { company_name: '', email: '', phone: '', address: '', copyright: '', description: '', pages: [], important_links: [], social_profiles: [] },
                            seo: { meta_title: '', meta_description: '', meta_keywords: '', og_image: '' }
                          });
                          setIsEditing(false);
                          toast.success('All fields cleared');
                        }
                      }}
                      className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className={sidebarOpen ? 'col-lg-9 col-xl-10' : 'col-12'}>
            <form onSubmit={handleSubmit}>
              {renderTabContent()}

              {/* Action Buttons */}
              <div className="card shadow-sm border-0 mt-4">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-primary bg-opacity-10 p-2 rounded">
                          <Save className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h5 className="mb-1 fw-semibold">Save Changes</h5>
                          <p className="text-muted mb-0 small">
                            {isEditing ? 'Update the entire homepage' : 'Create new homepage'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex flex-wrap gap-2 justify-content-md-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn btn-success d-flex align-items-center gap-2"
                        >
                          <Save className="h-4 w-4" />
                          {loading ? 'Saving...' : isEditing ? 'Update Homepage' : 'Create Homepage'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Stats Cards */}
            <div className="row mt-4 g-3">
              <div className="col-md-3">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-primary bg-opacity-10 p-2 rounded">
                        <Home className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-muted mb-1 small">Sections</p>
                        <h5 className="mb-0 fw-semibold">{tabs.length}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-success bg-opacity-10 p-2 rounded">
                        <Target className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <p className="text-muted mb-1 small">Categories</p>
                        <h5 className="mb-0 fw-semibold">{formData.featured_categories.categories.length}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-info bg-opacity-10 p-2 rounded">
                        <Users className="h-5 w-5 text-info" />
                      </div>
                      <div>
                        <p className="text-muted mb-1 small">Testimonials</p>
                        <h5 className="mb-0 fw-semibold">{formData.testimonials.testimonials.length}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-warning bg-opacity-10 p-2 rounded">
                        <TrendingUp className="h-5 w-5 text-warning" />
                      </div>
                      <div>
                        <p className="text-muted mb-1 small">Products</p>
                        <h5 className="mb-0 fw-semibold">{formData.popular_products.products.length}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Data Summary */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="card shadow-sm border-0">
                  <div className="card-body">
                    <h6 className="fw-semibold mb-3">Data Summary</h6>
                    <div className="row">
                      <div className="col-md-3 col-6 mb-3">
                        <div className="text-center">
                          <div className="h4 fw-bold text-primary">{formData.experts_section.experts.length}</div>
                          <small className="text-muted">Experts</small>
                        </div>
                      </div>
                      <div className="col-md-3 col-6 mb-3">
                        <div className="text-center">
                          <div className="h4 fw-bold text-success">{formData.statistics.stats.length}</div>
                          <small className="text-muted">Statistics</small>
                        </div>
                      </div>
                      <div className="col-md-3 col-6 mb-3">
                        <div className="text-center">
                          <div className="h4 fw-bold text-info">{formData.footer.pages.length + formData.footer.important_links.length}</div>
                          <small className="text-muted">Footer Links</small>
                        </div>
                      </div>
                      <div className="col-md-3 col-6 mb-3">
                        <div className="text-center">
                          <div className="h4 fw-bold text-warning">{Object.keys(formData).length}</div>
                          <small className="text-muted">Total Sections</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageManagement;