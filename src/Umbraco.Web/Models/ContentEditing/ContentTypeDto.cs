using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Umbraco.Web.Models.ContentEditing
{
    [DataContract(Name = "contentPropertyGroup", Namespace = "")]
    public class ContentTypeDto : ContentTypeBasic
    {
        [DataMember(Name = "groups")]
        public IEnumerable<ContentPropertyGroupDisplay> Groups { get; set; }
    }
}
