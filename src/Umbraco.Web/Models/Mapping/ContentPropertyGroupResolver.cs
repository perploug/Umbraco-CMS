using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Core.Models;
using Umbraco.Core.PropertyEditors;
using Umbraco.Web.Models.ContentEditing;

namespace Umbraco.Web.Models.Mapping
{
    internal class ContentPropertyGroupDtoResolver : ValueResolver<IContentType, IEnumerable<ContentPropertyGroupDisplay>>
    {
        protected override IEnumerable<ContentPropertyGroupDisplay> ResolveCore(IContentType source)
        {
 	        var groups = new List<ContentPropertyGroupDisplay>();

            var propGroups = source.CompositionPropertyGroups;
            var genericGroup = new ContentPropertyGroupDisplay() { Name = "properties", Columns = 12, Id = 0, ParentGroupId = 0 };
            genericGroup.Properties = mapProperties(source.PropertyTypes);
            genericGroup.Groups = new List<ContentPropertyGroupDisplay>();

            foreach (var group in propGroups.Where(pg => pg.ParentId.HasValue == false))
            {
                var mapped = new ContentPropertyGroupDisplay() { Columns = group.Columns, Id = group.Id, ParentGroupId = 0, Name = group.Name, SortOrder = group.SortOrder };
                mapped.Properties = mapProperties(group.PropertyTypes);
                mapped.Groups = mapChildGroups(mapped, propGroups);
                groups.Add(mapped);
            }

            groups.Add(genericGroup);
            return groups;
        }

        private IEnumerable<ContentPropertyGroupDisplay> mapChildGroups(ContentPropertyGroupDisplay parent, IEnumerable<PropertyGroup> groups)
        {
            var mappedGroups = new List<ContentPropertyGroupDisplay>();
            
            foreach (var child in groups.Where(x => x.ParentId == parent.Id))
            {
                var mapped = new ContentPropertyGroupDisplay() { Columns = child.Columns, Id = child.Id, ParentGroupId = child.ParentId.Value, Name = child.Name, SortOrder = child.SortOrder };
                mapped.Name += child.PropertyTypes.Count.ToString();
                mapped.Properties = mapProperties(child.PropertyTypes);               
                mapped.Groups = mapChildGroups(mapped, groups);
                mappedGroups.Add(mapped);
            }

            return mappedGroups;
        }

        private IEnumerable<ContentPropertyDisplay> mapProperties(IEnumerable<PropertyType> properties)
        {
            var mappedProperties = new List<ContentPropertyDisplay>();
            foreach (var p in properties)
            {
                var editor = PropertyEditorResolver.Current.GetByAlias(p.PropertyEditorAlias);
                var preVals = UmbracoContext.Current.Application.Services.DataTypeService.GetPreValuesCollectionByDataTypeId(p.DataTypeDefinitionId);

                mappedProperties.Add(
                    new ContentPropertyDisplay()
                    {
                        Alias = p.Alias,
                        Description = p.Description,
                        Editor = p.PropertyEditorAlias,
                        Validation = new PropertyTypeValidation() { Mandatory = p.Mandatory, Pattern = p.ValidationRegExp },
                        Label = p.Name,
                        View = editor.ValueEditor.View,
                        DataType = p.DataTypeDefinitionId,
                        Config = editor.PreValueEditor.ConvertDbToEditor(editor.DefaultPreValues, preVals) ,
                        Value = ""
                    });
            }

            return mappedProperties;
        }
    }
}
